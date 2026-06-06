// GET     /api/v1/users/me
// (Get authenticated user's profile details)

import { Router } from "express";
import validateRequest from "../../middleware/schemal.validator";
import { authMiddleware } from "../../middleware/auth.middleware";
import userController from "./user.controller";

// PATCH   /api/v1/users/me
// (Update authenticated user's profile information)

// PATCH   /api/v1/users/me/avatar
// (Upload or update authenticated user's avatar)

// DELETE  /api/v1/users/me/avatar
// (Remove authenticated user's avatar)

// DELETE  /api/v1/users/me
// (Soft delete authenticated user's account)

const userRouter = Router();


// Auth Middlewares
userRouter.use(authMiddleware.auth);
userRouter.use(authMiddleware.customer);


/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get my profile
 *     description: Retrieve the authenticated user's profile details.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
userRouter.get(
  "/me",
  userController.getMe,
);

export default userRouter;
