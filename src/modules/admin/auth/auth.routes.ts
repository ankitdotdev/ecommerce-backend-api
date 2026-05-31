import { Router } from "express";
import validateRequest from "../../../middleware/schemal.validator";
import { loginValidationSchema } from "./auth.schema";
import authController from "./auth.controller";





const authRouter = Router();
// LOGIN_________________________________________________________

/**
 * @swagger
 * /api/v1/admin/auth/login:
 *   post:
 *     summary: Login verified user
 *     tags:
 *       - Admin-Auth
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


export default  authRouter