// Routes.js
import express from "express";
import { getUser } from "../controllers/userController.js";
import {
  Registration,
  Login,
  RefreshToken,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";
import upload from "../config/multerConfig.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  validateRegister,
  validateLogin,
} from "../validations/authValidator.js";

const router = express.Router();

//authentication
router.post("/create", upload, validateRegister, Registration);
router.post("/login", validateLogin, Login);
router.post("/refresh-token", RefreshToken);
router.post("/forget", requestPasswordReset);
router.post("/reset-password", resetPassword);

// router.post("/forgot-password", forgotPassword);
// router.post("/verify-otp", verifyOtp);

router.get("/get", authMiddleware, getUser);

export default router;
