import { Router } from "express";
import validateRequest from "../../../middleware/schemal.validator";
import { createProductValidationSchema } from "./products.schema";
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

export default productRouter;
