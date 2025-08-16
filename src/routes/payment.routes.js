import express from 'express';
import { createPayment, confirmPayment } from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/create', createPayment);
router.post('/confirm', confirmPayment);
// REMOVED: create-payment-intent route

export default router;