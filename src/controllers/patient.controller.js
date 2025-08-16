import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Report from '../models/Report.js';

export const searchDoctors = async (req, res) => {
    try {
        const { specialty, location, clinicType, name } = req.query;

        const query = {};
        if (specialty) query.specialty = new RegExp(specialty, 'i');
        if (location) query.location = new RegExp(location, 'i');
        if (clinicType) query['clinic.type'] = clinicType;

        const doctors = await Doctor.find(query)
            .populate('userId', 'name email phone')
            .select('-__v');

        if (name) {
            const filteredDoctors = doctors.filter(doc =>
                doc.userId.name.toLowerCase().includes(name.toLowerCase())
            );
            return res.status(200).json({
                success: true,
                data: filteredDoctors
            });
        }

        res.status(200).json({
            success: true,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getDoctorSchedule = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query;

        // Get doctor's available slots
        const doctor = await Doctor.findById(doctorId)
            .populate('schedule');

        // Get booked appointments for the date
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const bookedAppointments = await Appointment.find({
            doctorId,
            appointmentDate: {
                $gte: startDate,
                $lte: endDate
            },
            status: { $in: ['pending', 'confirmed'] }
        }).select('timeSlot');

        const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);

        // Generate available slots (example: 9 AM to 5 PM, 30-minute slots)
        const allSlots = [];
        for (let hour = 9; hour < 17; hour++) {
            allSlots.push(`${hour}:00`);
            allSlots.push(`${hour}:30`);
        }

        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        res.status(200).json({
            success: true,
            data: {
                date,
                availableSlots,
                bookedSlots
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
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
                message: 'Patient profile not found'
            });
        }

        // Get doctor details
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Check if slot is available
        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentDate,
            timeSlot,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'This slot is already booked'
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patientId: patient._id,
            doctorId,
            appointmentDate,
            timeSlot,
            amount: doctor.fee,
            status: 'pending'
        });

        // Send notification (implement notification service)
        // await sendNotification(patient, doctor, appointment);

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
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
                message: 'Patient profile not found'
            });
        }

        const query = { patientId: patient._id };

        if (status) query.status = status;
        if (startDate && endDate) {
            query.appointmentDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const appointments = await Appointment.find(query)
            .populate({
                path: 'doctorId',
                populate: {
                    path: 'userId',
                    select: 'name email phone'
                }
            })
            .sort('-appointmentDate');

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
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
            patientId: patient._id
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check if appointment can be cancelled (e.g., 24 hours before)
        const appointmentTime = new Date(appointment.appointmentDate);
        const now = new Date();
        const hoursDiff = (appointmentTime - now) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel appointment less than 24 hours before'
            });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMedicalHistory = async (req, res) => {
    try {
        const patientId = req.user._id;

        const patient = await Patient.findOne({ userId: patientId });

        const medicalRecords = await MedicalRecord.find({ patientId: patient._id })
            .populate({
                path: 'appointmentId',
                populate: {
                    path: 'doctorId',
                    populate: {
                        path: 'userId',
                        select: 'name'
                    }
                }
            })
            .sort('-visitDate');

        const reports = await Report.find({ patientId: patient._id })
            .populate('uploadedBy', 'name')
            .sort('-uploadDate');

        res.status(200).json({
            success: true,
            data: {
                medicalRecords,
                reports
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};