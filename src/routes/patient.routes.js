import express from 'express';
import {
    searchDoctors,
    getDoctorSchedule,
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getMedicalHistory
} from '../controllers/patient.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('patient'));

router.get('/doctors/search', searchDoctors);
router.get('/doctors/:doctorId/schedule', getDoctorSchedule);
router.post('/appointments/book', bookAppointment);
router.get('/appointments', getMyAppointments);
router.put('/appointments/:appointmentId/cancel', cancelAppointment);
router.get('/medical-history', getMedicalHistory);

export default router;