import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import { sendEmail } from '../utils/email.js';
// REMOVED: import Stripe

export const createPayment = async (req, res) => {
    try {
        const { appointmentId, paymentMethod } = req.body;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Simple payment creation - no Stripe
        const payment = await Payment.create({
            appointmentId,
            amount: appointment.amount,
            paymentMethod: paymentMethod || 'cash',
            status: 'pending'
        });

        res.status(200).json({
            success: true,
            message: 'Payment record created. Please pay at the clinic.',
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const confirmPayment = async (req, res) => {
    try {
        const { paymentId } = req.body;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Manual payment confirmation (admin or clinic staff)
        payment.status = 'completed';
        payment.paymentDate = new Date();
        await payment.save();

        // Update appointment status
        const appointment = await Appointment.findById(payment.appointmentId);
        appointment.status = 'confirmed';
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Payment confirmed',
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};