import express from 'express';
import Appointment from '../models/Appointment.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/:appointmentId', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId)
            .populate('patientId')
            .populate('doctorId');

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/:appointmentId/reschedule', async (req, res) => {
    try {
        const { appointmentDate, timeSlot } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.appointmentId,
            { appointmentDate, timeSlot },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Appointment rescheduled successfully',
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;