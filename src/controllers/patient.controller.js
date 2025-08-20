import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Report from "../models/Report.js";

export const searchDoctors = async (req, res) => {
  try {
    const { specialty, location, clinicType, name } = req.query;

    const query = {};
    if (specialty) query.specialty = new RegExp(specialty, "i");
    if (location) query.location = new RegExp(location, "i");
    if (clinicType) query["clinic.type"] = clinicType;

    const doctors = await Doctor.find(query)
      .populate("userId", "name email phone")
      .select("-__v");

    // Filter by name if provided
    let filteredDoctors = doctors;
    if (name) {
      filteredDoctors = doctors.filter(
        (doc) =>
          doc.userId &&
          doc.userId.name &&
          doc.userId.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Log available doctors for debugging
    console.log(
      `🔍 Found ${filteredDoctors.length} doctors matching search criteria`
    );
    filteredDoctors.forEach((doc) => {
      console.log(
        `  - ${doc._id}: ${doc.userId?.name || "No name"} (${doc.specialty})`
      );
    });

    res.status(200).json({
      success: true,
      data: filteredDoctors,
    });
  } catch (error) {
    console.error("Error in searchDoctors:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDoctorDetails = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId)
      .populate("userId", "name email phone")
      .select("-__v");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Only show approved clinics to public
    if (doctor.clinic && doctor.clinic.status !== "approved") {
      doctor.clinic = null;
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    // Validate doctorId
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    // Validate date
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // Check if doctorId is a valid ObjectId
    if (!doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format",
      });
    }

    // Get doctor's available slots
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Validate and parse date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // Get booked appointments for the date
    const startDate = new Date(parsedDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(parsedDate);
    endDate.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: startDate,
        $lte: endDate,
      },
      status: { $in: ["pending", "confirmed"] },
    }).select("timeSlot");

    const bookedSlots = bookedAppointments.map((apt) => apt.timeSlot);

    // Generate available slots (example: 9 AM to 5 PM, 30-minute slots)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      allSlots.push(`${hour}:00`);
      allSlots.push(`${hour}:30`);
    }

    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.status(200).json({
      success: true,
      data: {
        date: date,
        availableSlots,
        bookedSlots,
      },
    });
  } catch (error) {
    console.error("Error in getDoctorSchedule:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching doctor schedule",
    });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot } = req.body;
    const patientId = req.user._id;

    // Get patient profile
    const patient = await Patient.findOne({ userId: patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    // Get doctor details
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      appointmentDate,
      timeSlot,
      amount: doctor.fee,
      status: "pending",
    });

    // Send notification (implement notification service)
    // await sendNotification(patient, doctor, appointment);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { status, startDate, endDate } = req.query;

    const patient = await Patient.findOne({ userId: patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const query = { patientId: patient._id };

    if (status) query.status = status;
    if (startDate && endDate) {
      query.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .sort("-appointmentDate");

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const patientId = req.user._id;

    const patient = await Patient.findOne({ userId: patientId });

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patientId: patient._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check if appointment can be cancelled (24 hours before rule)
    const appointmentTime = new Date(appointment.appointmentDate);

    // Parse time slot and add to appointment date
    if (appointment.timeSlot) {
      const [hours, minutes] = appointment.timeSlot.split(":").map(Number);
      appointmentTime.setHours(hours, minutes || 0, 0, 0);
    }

    const now = new Date();
    const hoursDiff = (appointmentTime - now) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      const hoursLeft = Math.round(hoursDiff);
      return res.status(400).json({
        success: false,
        message: `لا يمكن إلغاء الموعد. يجب أن يكون لديك 24 ساعة على الأقل قبل الموعد للإلغاء. الوقت المتبقي: ${hoursLeft} ساعة`,
        code: "CANCELLATION_TOO_LATE",
        hoursRemaining: hoursLeft,
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { doctorId, appointmentDate, timeSlot } = req.body;
    const patientId = req.user._id;

    // Validate required fields
    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID, appointment date, and time slot are required",
      });
    }

    const patient = await Patient.findOne({ userId: patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Find the existing appointment
    const existingAppointment = await Appointment.findOne({
      _id: appointmentId,
      patientId: patient._id,
    });

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check if appointment can be updated (same 24-hour rule as cancellation)
    const appointmentTime = new Date(existingAppointment.appointmentDate);
    if (existingAppointment.timeSlot) {
      const [hours, minutes] = existingAppointment.timeSlot
        .split(":")
        .map(Number);
      appointmentTime.setHours(hours, minutes || 0, 0, 0);
    }

    const now = new Date();
    const hoursDiff = (appointmentTime - now) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      const hoursLeft = Math.round(hoursDiff);
      return res.status(400).json({
        success: false,
        message: `لا يمكن تعديل الموعد. يجب أن يكون لديك 24 ساعة على الأقل قبل الموعد للتعديل. الوقت المتبقي: ${hoursLeft} ساعة`,
        code: "UPDATE_TOO_LATE",
        hoursRemaining: hoursLeft,
      });
    }

    // Validate new doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if new slot is available (exclude current appointment)
    const newAppointmentDate = new Date(appointmentDate);
    const existingNewSlot = await Appointment.findOne({
      _id: { $ne: appointmentId }, // Exclude current appointment
      doctorId,
      appointmentDate: newAppointmentDate,
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingNewSlot) {
      return res.status(400).json({
        success: false,
        message: "الموعد الجديد محجوز بالفعل. يرجى اختيار موعد آخر",
      });
    }

    // Update the appointment
    existingAppointment.doctorId = doctorId;
    existingAppointment.appointmentDate = newAppointmentDate;
    existingAppointment.timeSlot = timeSlot;
    existingAppointment.amount = doctor.fee;
    existingAppointment.status = "pending"; // Reset to pending for new appointment

    await existingAppointment.save();

    // Populate the response with doctor details
    const updatedAppointment = await Appointment.findById(appointmentId)
      .populate("doctorId", "userId specialty location fee")
      .populate({
        path: "doctorId.userId",
        select: "name email phone",
      });

    res.status(200).json({
      success: true,
      message: "تم تحديث الموعد بنجاح",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء تحديث الموعد",
    });
  }
};

export const getMedicalHistory = async (req, res) => {
  try {
    const patientId = req.user._id;

    const patient = await Patient.findOne({ userId: patientId });

    const medicalRecords = await MedicalRecord.find({ patientId: patient._id })
      .populate({
        path: "appointmentId",
        populate: {
          path: "doctorId",
          populate: {
            path: "userId",
            select: "name",
          },
        },
      })
      .sort("-visitDate");

    const reports = await Report.find({ patientId: patient._id })
      .populate("uploadedBy", "name")
      .sort("-uploadDate");

    res.status(200).json({
      success: true,
      data: {
        medicalRecords,
        reports,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
