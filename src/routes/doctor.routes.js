import express from 'express';
import {
    getDoctorProfile,
    updateDoctorProfile,
    updateClinicInfo,
    manageSchedule,
    getDoctorAppointments,
    getAppointmentStatistics,
    addMedicalRecord,
    uploadPatientReport,
    submitClinicForApproval,
    getClinicStatus, 
    getAllDoctors
} from '../controllers/doctor.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.config.js';

const router = express.Router();

router.get('/', getAllDoctors);

router.use(authenticate);
router.use(authorize('doctor'));

router.get('/profile', getDoctorProfile);
router.put('/profile', upload.single('doctorPhoto'), updateDoctorProfile);
router.put('/clinic', upload.array('clinicImages', 5), updateClinicInfo);
router.post('/schedule', manageSchedule);
router.get('/appointments', getDoctorAppointments);
router.get('/statistics', getAppointmentStatistics);
router.post('/medical-records', addMedicalRecord);
router.post('/reports/upload', upload.single('medicalReport'), uploadPatientReport);
router.post('/clinic/submit', authenticate, authorize('doctor'), submitClinicForApproval);
router.get('/clinic/status', authenticate, authorize('doctor'), getClinicStatus);

export default router;