import { Router } from "express";
import validateRequest from "../../../middleware/schemal.validator";
import {
  createProductValidationSchema,
  deleteProductValidationSchema,
  getAllProductsValidationSchema,
  productIdValidationSchema,
  updateProductValidationSchema,
} from "./products.schema";
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

// GET_PRODUCT_DETAILS _____________________________________________
/**
 * @swagger
 * /api/v1/admin/products/{productId}:
 *   get:
 *     summary: Get product details
 *     tags:
 *       - Admin Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
productRouter.get(
  "/:productId",
  validateRequest(productIdValidationSchema),
  productsController.getProductDetails,
);

// UPDATE_PRODUCTS ___________________________________

/**
 * @swagger
 * /api/v1/admin/products/{productId}:
 *   patch:
 *     summary: Update product
 *     tags:
 *       - Admin Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - DRAFT
 *                   - ACTIVE
 *                   - INACTIVE
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
productRouter.patch(
  "/:productId",
  validateRequest(updateProductValidationSchema),
  productsController.updateProduct,
);

/**
 * @swagger
 * /api/v1/admin/products/{productId}:
 *   delete:
 *     summary: Delete a product
 *     description: Soft delete a product by marking it as deleted and storing the deletion reason.
 *     tags:
 *       - Admin Products
 *     security:
 *       - cookieAuth: []
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
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 example: Product discontinued and replaced with a newer version
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Product not found
 *       409:
 *         description: Product has already been deleted
 */
productRouter.delete(
  "/:productId",
  validateRequest(deleteProductValidationSchema),
  productsController.deleteProduct,
);

export default productRouter;
