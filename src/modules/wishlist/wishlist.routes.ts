// POST   /api/v1/wishlist/:productId
// (Add product to wishlist)

// GET    /api/v1/wishlist
// (Get wishlist products)

// DELETE /api/v1/wishlist/:productId
// (Remove product from wishlist)

// DELETE /api/v1/wishlist
// (Clear wishlist)

import { Router } from "express";

import validateRequest from "../../middleware/schemal.validator";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  addToWishlistValidationSchema,
  removeFromWishlistValidationSchema,
} from "./wishlist.schema";
import wishlistController from "./wishlist.controller";

const wishlistRouter = Router();

wishlistRouter.use(authMiddleware.auth);
wishlistRouter.use(authMiddleware.customer);

/**
 * @swagger
 * /api/v1/wishlist/{productId}:
 *   post:
 *     summary: Add product to wishlist
 *     description: Add a product to the authenticated user's wishlist.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       201:
 *         description: Product added to wishlist successfully
 *       400:
 *         description: Product already exists in wishlist
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
wishlistRouter.post(
  "/:productId",
  validateRequest(addToWishlistValidationSchema),
  wishlistController.addToWishlist,
);

/**
 * @swagger
 * /api/v1/wishlist:
 *   get:
 *     summary: Get wishlist
 *     description: Retrieve all products in the authenticated user's wishlist.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *       401:
 *         description: Unauthorized
 */
wishlistRouter.get("/", wishlistController.getWishlist);

/**
 * @swagger
 * /api/v1/wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     description: Remove a product from the authenticated user's wishlist.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found in wishlist
 */
wishlistRouter.delete(
  "/:productId",
  validateRequest(removeFromWishlistValidationSchema),
  wishlistController.removeFromWishlist,
);

/**
 * @swagger
 * /api/v1/wishlist:
 *   delete:
 *     summary: Clear wishlist
 *     description: Remove all products from the authenticated user's wishlist.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist cleared successfully
 *       401:
 *         description: Unauthorized
 */
wishlistRouter.delete("/", wishlistController.clearWishlist);

export default wishlistRouter;
