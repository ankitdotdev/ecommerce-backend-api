// Authentication APIs
// Method	Endpoint	Description
// POST	/api/auth/register	Register new user
// POST	/api/auth/verify-otp	Verify email OTP
// POST	/api/auth/resend-otp	Resend verification OTP
// POST	/api/auth/login	Login verified user
// POST	/api/auth/forgot-password	Send password reset OTP
// POST	/api/auth/reset-password	Reset password using OTP
// PUT	/api/auth/change-password	Change password while logged in

import { Router } from "express";
import authController from "./auth.controller";
import validateRequest from "../../middleware/schemal.validator";
import {
  registerValidationSchema,
  resendOtpValidationSchema,
  verifyOtpValidationSchema,
} from "./auth.schema";

const authRouter = Router();

// USER REGISTER _______________________________________________

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

authRouter.post(
  "/register",
  validateRequest(registerValidationSchema),
  authController.registerUser,
);

// VERIFY OTP ____________________________________________________
// auth.routes.ts

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify email OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */

authRouter.post(
  "/verify-otp",
  validateRequest(verifyOtpValidationSchema),
  authController.verifyOtp,
);

// RESEND OTP _______________________________________________________________
// auth.routes.ts

/**
 * @swagger
 * /api/v1/auth/resend-otp:
 *   post:
 *     summary: Resend verification OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: ankitmishra.dev11@gmail.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 */

authRouter.post(
  "/resend-otp",

  validateRequest(resendOtpValidationSchema),

  authController.resendOtp,
);
export default authRouter;
