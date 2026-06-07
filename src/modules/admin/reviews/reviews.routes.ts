// GET    /api/v1/admin/reviews
// (Get paginated list of reviews with filters)

// GET    /api/v1/admin/reviews/:reviewId
// (Get complete details of a specific review)

// DELETE /api/v1/admin/reviews/:reviewId
// (Delete any review)

import { Router } from "express";

import validateRequest from "../../../middleware/schemal.validator";
import { authMiddleware } from "../../../middleware/auth.middleware";
import reviewsController from "./reviews.controller";
import {
  deleteReviewValidationSchema,
  getReviewByIdValidationSchema,
  getReviewsValidationSchema,
} from "./reviews.schema";

const reviewRouter = Router();

reviewRouter.use(authMiddleware.auth);
reviewRouter.use(authMiddleware.admin);

/**
 * @swagger
 * /api/v1/admin/reviews:
 *   get:
 *     summary: Get reviews
 *     description: Retrieve a paginated list of reviews with optional search, filtering, and sorting.
 *     tags:
 *       - Admin Reviews
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
 *         description: Number of reviews per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: iphone
 *         description: Search by customer name or product name
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         description: Filter reviews by rating
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - rating
 *             - createdAt
 *             - updatedAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       401:
 *         description: Unauthorized
 */
reviewRouter.get(
  "/",
  validateRequest(getReviewsValidationSchema),
  reviewsController.getReviews,
);

/**
 * @swagger
 * /api/v1/admin/reviews/{reviewId}:
 *   get:
 *     summary: Get review details
 *     description: Retrieve complete details of a specific review.
 *     tags:
 *       - Admin Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       404:
 *         description: Review not found
 */
reviewRouter.get(
  "/:reviewId",
  validateRequest(getReviewByIdValidationSchema),
  reviewsController.getReviewById,
);

/**
 * @swagger
 * /api/v1/admin/reviews/{reviewId}:
 *   delete:
 *     summary: Delete review
 *     description: Soft delete any review and record the deletion reason for audit purposes.
 *     tags:
 *       - Admin Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
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
 *                 example: Review contains inappropriate content
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
reviewRouter.delete(
  "/:reviewId",
  validateRequest(deleteReviewValidationSchema),
  reviewsController.deleteReview,
);

export default reviewRouter;
