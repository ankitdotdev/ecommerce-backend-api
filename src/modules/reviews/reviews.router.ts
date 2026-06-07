// POST   /api/v1/reviews/:productId
// (Create a review for a purchased product)

// GET    /api/v1/reviews/product/:productId
// (Get all reviews for a specific product)

// PATCH  /api/v1/reviews/:reviewId
// (Update own review)

// DELETE /api/v1/reviews/:reviewId
// (Delete own review)

import { Router } from "express";

import validateRequest from "../../middleware/schemal.validator";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  createReviewValidationSchema,
  getProductReviewsValidationSchema,
  updateReviewValidationSchema,
  deleteReviewValidationSchema,
} from "./reviews.schema";
import reviewsController from "./reviews.controller";

const reviewRouter = Router();

reviewRouter.use(authMiddleware.auth);
reviewRouter.use(authMiddleware.customer);

/**
 * @swagger
 * /api/v1/reviews/{productId}:
 *   post:
 *     summary: Create review
 *     description: Create a review for a purchased product.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               title:
 *                 type: string
 *                 example: Excellent Product
 *               comment:
 *                 type: string
 *                 example: The quality exceeded my expectations.
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid review details
 *       404:
 *         description: Product not found
 */
reviewRouter.post(
  "/:productId",
  validateRequest(createReviewValidationSchema),
  reviewsController.createReview,
);

/**
 * @swagger
 * /api/v1/reviews/product/{productId}:
 *   get:
 *     summary: Get product reviews
 *     description: Retrieve paginated reviews for a specific product.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       404:
 *         description: Product not found
 */
reviewRouter.get(
  "/product/:productId",
  validateRequest(getProductReviewsValidationSchema),
  reviewsController.getProductReviews,
);

/**
 * @swagger
 * /api/v1/reviews/{reviewId}:
 *   patch:
 *     summary: Update review
 *     description: Update a review created by the authenticated user.
 *     tags:
 *       - Reviews
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
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 */
reviewRouter.patch(
  "/:reviewId",
  validateRequest(updateReviewValidationSchema),
  reviewsController.updateReview,
);

/**
 * @swagger
 * /api/v1/reviews/{reviewId}:
 *   delete:
 *     summary: Delete review
 *     description: Soft delete a review created by the authenticated user.
 *     tags:
 *       - Reviews
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
