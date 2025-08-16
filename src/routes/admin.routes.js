import express from 'express';
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    manageSpecialties,
    getGlobalStatistics,
    handleRefund,
    getPendingClinics,
    approveClinic,
    rejectClinic,
    getClinicStatistics
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.all('/specialties', manageSpecialties);
router.get('/statistics', getGlobalStatistics);
router.post('/refunds', handleRefund);
router.get('/clinics/pending', authenticate, authorize('admin'), getPendingClinics);
router.put('/clinics/:doctorId/approve', authenticate, authorize('admin'), approveClinic);
router.put('/clinics/:doctorId/reject', authenticate, authorize('admin'), rejectClinic);
router.get('/clinics/statistics', authenticate, authorize('admin'), getClinicStatistics);

export default router;