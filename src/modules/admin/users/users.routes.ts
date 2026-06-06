// GET     /api/v1/users
// (Get paginated list of users with search and filters)

import { Router } from "express";
import validateRequest from "../../../middleware/schemal.validator";
import {
  blockUserValidationSchema,
  getUserByIdValidationSchema,
  getUserStatsValidationSchema,
  getUsersValidationSchema,
  unblockUserValidationSchema,
} from "./users.schema";
import usersController from "./users.controller";

// GET     /api/v1/users/:userId
// (Get complete details of a specific user)

// PATCH   /api/v1/users/:userId/block
// (Block a user account and record the reason)

// PATCH   /api/v1/users/:userId/unblock
// (Unblock a previously blocked user account)

// GET     /api/v1/users/stats
// (Get user statistics and dashboard metrics)

const userRouter = Router();

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get users
 *     description: Retrieve a paginated list of users with optional search, filtering, and sorting.
 *     tags:
 *       - Admin Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: john
 *         description: Search users by name or email
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, blocked, inactive]
 *         description: Filter users by account status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - name
 *             - email
 *             - createdAt
 *             - updatedAt
 *             - lastLoginAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.get(
  "/",
  validateRequest(getUsersValidationSchema),
  usersController.getUsers,
);
/**
 * @swagger
 * /api/v1/admin/users/stats:
 *   get:
 *     summary: Get user statistics
 *     description: Retrieve user statistics and dashboard metrics.
 *     tags:
 *       - Admin Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.get(
  "/stats",
  validateRequest(getUserStatsValidationSchema),
  usersController.getUserStats,
);

/**
 * @swagger
 * /api/v1/admin/users/{userId}:
 *   get:
 *     summary: Get user details
 *     description: Retrieve complete details of a specific user.
 *     tags:
 *       - Admin Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
userRouter.get(
  "/:userId",
  validateRequest(getUserByIdValidationSchema),
  usersController.getUserById,
);

/**
 * @swagger
 * /api/v1/admin/users/{userId}/block:
 *   patch:
 *     summary: Block user
 *     description: Block a user account and record the reason.
 *     tags:
 *       - Admin Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Violation of platform policies
 *     responses:
 *       200:
 *         description: User blocked successfully
 *       404:
 *         description: User not found
 */
userRouter.patch(
  "/:userId/block",
  validateRequest(blockUserValidationSchema),
  usersController.blockUser,
);

/**
 * @swagger
 * /api/v1/admin/users/{userId}/unblock:
 *   patch:
 *     summary: Unblock user
 *     description: Unblock a previously blocked user account.
 *     tags:
 *       - Admin Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unblocked successfully
 *       404:
 *         description: User not found
 */
userRouter.patch(
  "/:userId/unblock",
  validateRequest(unblockUserValidationSchema),
  usersController.unblockUser,
);

export default userRouter;
