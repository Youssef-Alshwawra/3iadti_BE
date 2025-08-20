import express from "express";
import {
  register,
  login,
  verifyEmailOTP,
  resendEmailOTP,
  forgotPassword,
  verifyPasswordResetOTP,
  resetPassword,
  validateToken,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email-otp", verifyEmailOTP);
router.post("/resend-email-otp", resendEmailOTP);
router.post("/forgot-password", forgotPassword);
router.post("/verify-password-reset-otp", verifyPasswordResetOTP);
router.post("/reset-password", resetPassword);
router.get("/validate-token", authenticate, validateToken);

export default router;
