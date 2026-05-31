import { Router } from "express";
import validateRequest from "../../../middleware/schemal.validator";
import { createProductValidationSchema, getAllProductsValidationSchema } from "./products.schema";
import productsController from "./products.controller";

// Product APIs
// Method   Endpoint                              Description
//
// POST     /api/v1/admin/products                Create product
// GET      /api/v1/admin/products                Get all products
// GET      /api/v1/admin/products/:productId     Get single product
// PATCH    /api/v1/admin/products/:productId     Update product
// DELETE   /api/v1/admin/products/:productId     Soft delete product

const productRouter = Router();


// CREATE_PRODUCT ____________________________________

/**
 * @swagger
 * /api/v1/admin/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Admin Products
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - images
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 16 Pro
 *               description:
 *                 type: string
 *                 example: Latest Apple flagship smartphone
 *               price:
 *                 type: number
 *                 example: 129999
 *               stock:
 *                 type: number
 *                 example: 25
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - https://cdn.example.com/image1.jpg
 *                   - https://cdn.example.com/image2.jpg
 *               category:
 *                 type: string
 *                 example: Electronics
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - smartphone
 *                   - apple
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
productRouter.post(
  "/",
  validateRequest(createProductValidationSchema),
  productsController.createProduct,
);


// GET_ALL_PRODUCTS ___________________________________
/**
 * @swagger
 * /api/v1/admin/products:
 *   get:
 *     tags:
 *       - Admin Products
 *     summary: Get all products
 *     description: Retrieve a paginated list of products with search, filtering, and sorting options.
 *     security:
 *       - cookieAuth: []
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
 *           default: 10
 *         description: Number of products per page
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Nike
 *         description: Search products by product name
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - DRAFT
 *             - ACTIVE
 *             - INACTIVE
 *         description: Filter products by status
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
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
productRouter.get(
  "/",
  validateRequest(getAllProductsValidationSchema),
  productsController.getAllProducts,
);

export default productRouter;
