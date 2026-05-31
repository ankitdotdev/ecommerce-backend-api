// Cart APIs
// Method   Endpoint                               Description

// GET      /api/v1/cart                           Get current user's cart

// POST     /api/v1/cart/items                     Add product to cart

// PATCH    /api/v1/cart/items/:productId          Update product quantity in cart

// DELETE   /api/v1/cart/items/:productId          Remove product from cart

// DELETE   /api/v1/cart                           Clear entire cart

import { Router } from "express";

import validateRequest from "../../middleware/schemal.validator";
import cartController from "./cart.controller";
import {
  addToCartValidationSchema,
  clearCartValidationSchema,
  getCartValidationSchema,
  removeCartItemValidationSchema,
  updateCartItemValidationSchema,
} from "./cart.schema";
import { authMiddleware } from "../../middleware/auth.middleware";

const cartRouter = Router();

cartRouter.use(authMiddleware.auth);
cartRouter.use(authMiddleware.customer);

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get current user's cart
 *     description: Retrieve all items currently added to the authenticated user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */
cartRouter.get(
  "/",
  validateRequest(getCartValidationSchema),
  cartController.getCart,
);

/**
 * @swagger
 * /api/v1/cart/items:
 *   post:
 *     summary: Add product to cart
 *     description: Add a product to the authenticated user's cart. If the product already exists in the cart, its quantity will be increased.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 683b04b57b40dc8c0f0d9e12
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Product not found
 */
cartRouter.post(
  "/items",
  validateRequest(addToCartValidationSchema),
  cartController.addToCart,
);

/**
 * @swagger
 * /api/v1/cart/items/{productId}:
 *   patch:
 *     summary: Update cart item quantity
 *     description: Update the quantity of a product already present in the authenticated user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: 683b04b57b40dc8c0f0d9e12
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 5
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Product not found in cart
 */
cartRouter.patch(
  "/items/:productId",
  validateRequest(updateCartItemValidationSchema),
  cartController.updateCartItem,
);

/**
 * @swagger
 * /api/v1/cart/items/{productId}:
 *   delete:
 *     summary: Remove product from cart
 *     description: Remove a specific product from the authenticated user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: 683b04b57b40dc8c0f0d9e12
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       404:
 *         description: Product not found in cart
 */
cartRouter.delete(
  "/items/:productId",
  validateRequest(removeCartItemValidationSchema),
  cartController.removeCartItem,
);

/**
 * @swagger
 * /api/v1/cart:
 *   delete:
 *     summary: Clear cart
 *     description: Remove all items from the authenticated user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 */
cartRouter.delete(
  "/",
  validateRequest(clearCartValidationSchema),
  cartController.clearCart,
);

export default cartRouter;
