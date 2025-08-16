import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Report from '../models/Report.js';
import Schedule from '../models/Schedule.js';
import { sendEmail } from '../utils/email.js';

export const getDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.user._id;

        const doctor = await Doctor.findOne({ userId: doctorId })
            .populate('userId', 'name email phone');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const updates = req.body;

        // Handle photo upload if present
        if (req.file) {
            updates.photo = `/uploads/doctors/${req.file.filename}`;
        }

        const doctor = await Doctor.findOneAndUpdate(
            { userId: doctorId },
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateClinicInfo = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const clinicData = req.body;

        // Handle clinic images upload
        if (req.files && req.files.length > 0) {
            clinicData.images = req.files.map(file => `/uploads/clinics/${file.filename}`);
        }

        const doctor = await Doctor.findOneAndUpdate(
            { userId: doctorId },
            { clinic: clinicData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Clinic information updated successfully',
            data: doctor.clinic
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const manageSchedule = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const { dayOfWeek, slots, isAvailable } = req.body;

        const doctor = await Doctor.findOne({ userId: doctorId });

        let schedule = await Schedule.findOne({
            doctorId: doctor._id,
            dayOfWeek
        });

        if (schedule) {
            schedule.slots = slots;
            schedule.isAvailable = isAvailable;
            await schedule.save();
        } else {
            schedule = await Schedule.create({
                doctorId: doctor._id,
                dayOfWeek,
                slots,
                isAvailable
            });
        }

        res.status(200).json({
            success: true,
            message: 'Schedule updated successfully',
            data: schedule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const { date, status } = req.query;

        const doctor = await Doctor.findOne({ userId: doctorId });

        const query = { doctorId: doctor._id };

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            query.appointmentDate = {
                $gte: startDate,
                $lte: endDate
            };
        }

        if (status) query.status = status;

        const appointments = await Appointment.find(query)
            .populate({
                path: 'patientId',
                populate: {
                    path: 'userId',
                    select: 'name email phone'
                }
            })
            .sort('appointmentDate timeSlot');

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

export const getAppointmentStatistics = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const { startDate, endDate } = req.query;

        const doctor = await Doctor.findOne({ userId: doctorId });

        const query = { doctorId: doctor._id };

        if (startDate && endDate) {
            query.appointmentDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const totalAppointments = await Appointment.countDocuments(query);
        const completedAppointments = await Appointment.countDocuments({
            ...query,
            status: 'completed'
        });
        const cancelledAppointments = await Appointment.countDocuments({
            ...query,
            status: 'cancelled'
        });
        const pendingAppointments = await Appointment.countDocuments({
            ...query,
            status: 'pending'
        });

        const revenue = await Appointment.aggregate([
            { $match: { ...query, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalAppointments,
                completedAppointments,
                cancelledAppointments,
                pendingAppointments,
                totalRevenue: revenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const addMedicalRecord = async (req, res) => {
    try {
        const { appointmentId, diagnosis, prescription, notes } = req.body;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        const medicalRecord = await MedicalRecord.create({
            patientId: appointment.patientId,
            appointmentId,
            diagnosis,
            prescription,
            notes,
            visitDate: appointment.appointmentDate
        });

        // Update appointment status
        appointment.status = 'completed';
        await appointment.save();

        res.status(201).json({
            success: true,
            message: 'Medical record added successfully',
            data: medicalRecord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const uploadPatientReport = async (req, res) => {
    try {
        const { patientId, appointmentId, reportType, description } = req.body;
        const doctorId = req.user._id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const doctor = await Doctor.findOne({ userId: doctorId });

        const report = await Report.create({
            patientId,
            appointmentId,
            reportType,
            description,
            fileUrl: `/uploads/reports/${req.file.filename}`,
            uploadedBy: doctor._id,
            uploadDate: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Report uploaded successfully',
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const submitClinicForApproval = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const clinicData = req.body;

        // Handle clinic images upload if present
        if (req.files && req.files.length > 0) {
            clinicData.images = req.files.map(file => `/uploads/clinics/${file.filename}`);
        }

        // Set status to pending
        clinicData.status = 'pending';
        clinicData.submittedAt = new Date();

        const doctor = await Doctor.findOneAndUpdate(
            { userId: doctorId },
            { clinic: clinicData },
            { new: true, runValidators: true }
        );

        // Notify admins about new clinic submission
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
            await sendEmail({
                to: admin.email,
                subject: 'New Clinic Pending Approval',
                html: `
                    <div style="font-family: Arial, sans-serif;">
                        <h2>New Clinic Submission</h2>
                        <p>A new clinic has been submitted for approval:</p>
                        <ul>
                            <li><strong>Doctor:</strong> ${req.user.name}</li>
                            <li><strong>Clinic Name:</strong> ${clinicData.name}</li>
                            <li><strong>Address:</strong> ${clinicData.address}</li>
                            <li><strong>Submitted At:</strong> ${new Date().toLocaleString()}</li>
                        </ul>
                        <p>Please review and approve/reject in the admin panel.</p>
                    </div>
                `
            });
        }

        res.status(200).json({
            success: true,
            message: 'Clinic submitted for approval. You will be notified once reviewed.',
            data: doctor.clinic
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getClinicStatus = async (req, res) => {
    try {
        const doctorId = req.user._id;

        const doctor = await Doctor.findOne({ userId: doctorId })
            .select('clinic')
            .populate('clinic.reviewedBy', 'name');

        if (!doctor || !doctor.clinic) {
            return res.status(404).json({
                success: false,
                message: 'No clinic found'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor.clinic
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};