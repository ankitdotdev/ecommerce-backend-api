// Product APIs
// Method   Endpoint                           Description

import { Router } from "express";
import validateRequest from "../../middleware/schemal.validator";
import {
  getAllProductsValidationSchema,
  productSlugValidationSchema,
} from "./products.schema";
import productsController from "./products.controller";

// Public Routes
// GET      /api/v1/products                   Get active products
// GET      /api/v1/products/:slug             Get product details by slug

const productRouter = Router();
/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get active products
 *     description: Retrieve a paginated list of active products with search, category filtering, and sorting options.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *         description: Number of products per page
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: iphone
 *         description: Search products by name
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: Electronics
 *         description: Filter products by category
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - newest
 *             - oldest
 *             - price_asc
 *             - price_desc
 *         description: Sort products
 *
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
productRouter.get(
  "/",
  validateRequest(getAllProductsValidationSchema),
  productsController.getAllProducts,
);

/**
 * @swagger
 * /api/v1/products/{slug}:
 *   get:
 *     summary: Get product details
 *     description: Retrieve product details using product slug.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: iphone-16-pro
 *         description: Product slug
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
productRouter.get(
  "/:slug",
  validateRequest(productSlugValidationSchema),
  productsController.getProductDetails,
);

export default productRouter;
