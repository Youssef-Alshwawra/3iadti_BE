import express from "express";
import {
  searchDoctors,
  getDoctorDetails,
  getDoctorSchedule,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  updateAppointment,
  getMedicalHistory,
} from "../controllers/patient.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Doctor search and details - available to all authenticated users
router.get("/doctors/search", authenticate, searchDoctors);
router.get("/doctors/:doctorId", authenticate, getDoctorDetails);
router.get("/doctors/:doctorId/schedule", authenticate, getDoctorSchedule);

// Patient-specific routes - require patient role
router.use(authenticate);
router.use(authorize("patient"));

router.post("/appointments/book", bookAppointment);
router.get("/appointments", getMyAppointments);
router.put("/appointments/:appointmentId/cancel", cancelAppointment);
router.put("/appointments/:appointmentId/update", updateAppointment);
router.get("/medical-history", getMedicalHistory);

export default router;
