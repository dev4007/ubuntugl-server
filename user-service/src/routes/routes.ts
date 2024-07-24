// Routes.ts
import express from "express";
import { Registration, Login, RefreshToken, requestPasswordReset, resetPassword, } from "../controllers/authController";
import { getListUsers, getUserByIdController, deleteUserByIdController } from "../controllers/userController";
import upload from "../config/multerConfig";
import authMiddleware from "../middleware/AuthMiddleware";
import { validateRegister, validateLogin } from "../validation/authValidator"

const router = express.Router();

//authentication
router.post("/create", upload, validateRegister, Registration);
router.post("/login", validateLogin, Login);
router.post("/refresh-token", RefreshToken);
router.post("/forget-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

//user Details
router.get("/get",authMiddleware, getListUsers);
router.get("/:id", getUserByIdController);
router.delete("/delete/:id", authMiddleware, deleteUserByIdController);


export default router;