// Authentication APIs
// Method	Endpoint	Description
// POST	/api/auth/register	Register new user
// POST	/api/auth/verify-otp	Verify email OTP
// POST	/api/auth/resend-otp	Resend verification OTP
// POST	/api/auth/login	Login verified user
// POST	/api/auth/forgot-password	Send password reset OTP
// POST	/api/v1/auth/verify-reset-otp	Verify Reset OTP password
// POST	/api/auth/reset-password	Reset password
// PUT	/api/auth/change-password	Change password while logged in

import { Router } from "express";
import authController from "./auth.controller";
import validateRequest from "../../middleware/schemal.validator";
import {
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  loginValidationSchema,
  registerValidationSchema,
  resendOtpValidationSchema,
  resetPasswordValidationSchema,
  verifyOtpValidationSchema,
  verifyResetOtpValidationSchema,
} from "./auth.schema";
import authMiddleware from "../../middleware/auth.middleware";

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

// LOGIN_________________________________________________________

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login verified user
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
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: ankitmishra.dev11@gmail.com
 *               password:
 *                 type: string
 *                 example: Ankit@123
 *     responses:
 *       200:
 *         description: Login successful
 */

authRouter.post(
  "/login",

  validateRequest(loginValidationSchema),

  authController.loginUser,
);

// FORGOT_PASSWORD ______________________________________

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Send password reset OTP
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
 *         description: Password reset OTP sent successfully
 */

authRouter.post(
  "/forgot-password",

  validateRequest(forgotPasswordValidationSchema),

  authController.forgotPassword,
);

// VERIFY_RESET_PASSWORD_OTP _________________________________________
/**
 * @swagger
 * /api/v1/auth/verify-reset-otp:
 *   post:
 *     summary: Verify reset password OTP
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
 *                 example: ankitmishra.dev11@gmail.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Reset OTP verified successfully
 */

authRouter.post(
  "/verify-reset-otp",

  validateRequest(verifyResetOtpValidationSchema),

  authController.verifyResetOtp,
);
// RESET_PASSWORD _______________________________________

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password reset successful
 */

authRouter.post(
  "/reset-password",

  validateRequest(resetPasswordValidationSchema),

  authController.resetPassword,
);

// CHANGE_PASSWORD _______________________________________

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   put:
 *     summary: Change password while logged in
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: OldPassword@123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password changed successfully
 */

authRouter.put(
  "/change-password",

  authMiddleware,

  validateRequest(changePasswordValidationSchema),

  authController.changePassword,
);
export default authRouter;
