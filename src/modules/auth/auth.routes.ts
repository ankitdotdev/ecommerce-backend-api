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
import { registerValidationSchema } from "./auth.schema";

const authRouter = Router();


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
authRouter.post(
  "/register",
  validateRequest(registerValidationSchema),
  authController.registerUser,
);

export default authRouter;
