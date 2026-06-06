// GET     /api/v1/users/me  (Get authenticated user's profile details)
// PATCH   /api/v1/users/me (Update authenticated user's profile information)

import { Router } from "express";
import validateRequest from "../../middleware/schemal.validator";
import { authMiddleware } from "../../middleware/auth.middleware";
import userController from "./user.controller";
import { updateMeValidationSchema } from "./user.schema";
import { upload } from "../../middleware/multer";

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
userRouter.get("/me", userController.getMe);

/**
 * @swagger
 * /api/v1/users/me:
 *   patch:
 *     summary: Update my profile
 *     description: Update the authenticated user's profile information.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1998-06-15
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 */
userRouter.patch(
  "/me",
  validateRequest(updateMeValidationSchema),
  userController.updateMe,
);

/**
 * @swagger
 * /api/v1/users/me/avatar:
 *   patch:
 *     summary: Upload avatar
 *     description: Upload or update the authenticated user's profile avatar.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 */
userRouter.patch(
  "/me/avatar",
  upload.single("avatar"),
  userController.updateAvatar,
);

/**
 * @swagger
 * /api/v1/users/me/avatar:
 *   delete:
 *     summary: Remove avatar
 *     description: Remove the authenticated user's profile avatar.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar removed successfully
 *       404:
 *         description: User not found
 */
userRouter.delete("/me/avatar", userController.deleteAvatar);


// DELETE_ME ____________________________________
/**
 * @swagger
 * /api/v1/users/me:
 *   delete:
 *     summary: Delete my account
 *     description: Soft delete the authenticated user's account.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: User not found
 */
userRouter.delete("/me", userController.deleteMe);

export default userRouter;
