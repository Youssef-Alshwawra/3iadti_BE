import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';
import Specialty from '../models/Specialty.js';

export const getAllUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 10 } = req.query;

        const query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort('-createdAt');

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: users,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const { email, password, name, phone, role, ...additionalData } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            phone,
            role,
            isEmailVerified: true // Admin-created users are pre-verified
        });

        // Create role-specific profile
        if (role === 'patient') {
            await Patient.create({
                userId: user._id,
                address: additionalData.address,
                dateOfBirth: additionalData.dateOfBirth
            });
        } else if (role === 'doctor') {
            await Doctor.create({
                userId: user._id,
                specialty: additionalData.specialty,
                location: additionalData.location,
                fee: additionalData.fee
            });
        }

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete related data based on role
        if (user.role === 'patient') {
            await Patient.deleteOne({ userId });
        } else if (user.role === 'doctor') {
            await Doctor.deleteOne({ userId });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const manageSpecialties = async (req, res) => {
    try {
        const { action } = req.query;

        if (action === 'list') {
            const specialties = await Specialty.find();
            return res.status(200).json({
                success: true,
                data: specialties
            });
        }

        if (action === 'add') {
            const { name, description } = req.body;
            const specialty = await Specialty.create({ name, description });
            return res.status(201).json({
                success: true,
                message: 'Specialty added successfully',
                data: specialty
            });
        }

        if (action === 'update') {
            const { id, name, description } = req.body;
            const specialty = await Specialty.findByIdAndUpdate(
                id,
                { name, description },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: 'Specialty updated successfully',
                data: specialty
            });
        }

        if (action === 'delete') {
            const { id } = req.body;
            await Specialty.findByIdAndDelete(id);
            return res.status(200).json({
                success: true,
                message: 'Specialty deleted successfully'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getGlobalStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalAppointments = await Appointment.countDocuments();

        const revenue = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const monthlyStats = await Appointment.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$appointmentDate' },
                        month: { $month: '$appointmentDate' }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalDoctors,
                totalPatients,
                totalAppointments,
                totalRevenue: revenue[0]?.total || 0,
                monthlyStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const handleRefund = async (req, res) => {
    try {
        const { paymentId, reason } = req.body;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        if (payment.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Only completed payments can be refunded'
            });
        }

        // REMOVED: Stripe refund logic
        // Manual refund process
        payment.status = 'refunded';
        payment.refundReason = reason;
        payment.refundDate = new Date();
        await payment.save();

        res.status(200).json({
            success: true,
            message: 'Payment marked as refunded. Process manual refund.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPendingClinics = async (req, res) => {
    try {
        const pendingClinics = await Doctor.find({
            'clinic.status': 'pending'
        })
            .populate('userId', 'name email phone')
            .select('clinic specialty location userId');

        res.status(200).json({
            success: true,
            data: pendingClinics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const approveClinic = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const adminId = req.user._id;

        const doctor = await Doctor.findById(doctorId)
            .populate('userId', 'email name');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        if (!doctor.clinic || doctor.clinic.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'No pending clinic approval found'
            });
        }

        // Update clinic status
        doctor.clinic.status = 'approved';
        doctor.clinic.reviewedBy = adminId;
        doctor.clinic.reviewedAt = new Date();
        doctor.clinic.rejectionReason = null;
        await doctor.save();

        // Send approval email to doctor
        await sendEmail({
            to: doctor.userId.email,
            subject: 'Clinic Approved!',
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="color: #28a745;">Congratulations! Your Clinic Has Been Approved</h2>
                    <p>Dear Dr. ${doctor.userId.name},</p>
                    <p>We are pleased to inform you that your clinic "${doctor.clinic.name}" has been approved.</p>
                    <p>Your clinic is now visible to patients and you can start receiving appointments.</p>
                    <p>Thank you for joining our platform!</p>
                </div>
            `
        });

        res.status(200).json({
            success: true,
            message: 'Clinic approved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const rejectClinic = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { reason } = req.body;
        const adminId = req.user._id;

        const doctor = await Doctor.findById(doctorId)
            .populate('userId', 'email name');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        if (!doctor.clinic || doctor.clinic.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'No pending clinic approval found'
            });
        }

        // Update clinic status
        doctor.clinic.status = 'rejected';
        doctor.clinic.reviewedBy = adminId;
        doctor.clinic.reviewedAt = new Date();
        doctor.clinic.rejectionReason = reason;
        await doctor.save();

        // Send rejection email to doctor
        await sendEmail({
            to: doctor.userId.email,
            subject: 'Clinic Application Update',
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="color: #dc3545;">Clinic Application Requires Changes</h2>
                    <p>Dear Dr. ${doctor.userId.name},</p>
                    <p>Thank you for submitting your clinic "${doctor.clinic.name}" for approval.</p>
                    <p>After review, we need you to make some changes:</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
                        <strong>Reason:</strong> ${reason}
                    </div>
                    <p>Please update your clinic information and resubmit for approval.</p>
                    <p>If you have any questions, please contact our support team.</p>
                </div>
            `
        });

        res.status(200).json({
            success: true,
            message: 'Clinic rejected with reason'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getClinicStatistics = async (req, res) => {
    try {
        const totalClinics = await Doctor.countDocuments({ 'clinic': { $exists: true } });
        const pendingClinics = await Doctor.countDocuments({ 'clinic.status': 'pending' });
        const approvedClinics = await Doctor.countDocuments({ 'clinic.status': 'approved' });
        const rejectedClinics = await Doctor.countDocuments({ 'clinic.status': 'rejected' });

        res.status(200).json({
            success: true,
            data: {
                total: totalClinics,
                pending: pendingClinics,
                approved: approvedClinics,
                rejected: rejectedClinics
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};