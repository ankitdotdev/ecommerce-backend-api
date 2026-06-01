// Admin Order APIs

// Method	Endpoint	Description

// GET	/api/v1/admin/orders	Get all orders with pagination, filtering and search

// GET	/api/v1/admin/orders/:orderId	Get complete order details

// PATCH	/api/v1/admin/orders/:orderId/status	Update order status (pending, confirmed, processing, shipped, delivered, cancelled)

import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import {
  adminOrderParamsValidationSchema,
  getAllOrdersQueryValidationSchema,
  updateOrderStatusValidationSchema,
} from "./orders.schema";
import validateRequest from "../../../middleware/schemal.validator";
import ordersController from "./orders.controller";

const orderAdminRouter = Router();

orderAdminRouter.use(authMiddleware.auth);
orderAdminRouter.use(authMiddleware.admin);

// GET_ALL_ORDERS ________________________________________________________________

/**
 * @swagger
 * /api/v1/admin/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve all orders with pagination, filtering and search.
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderStatus
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - confirmed
 *             - processing
 *             - shipped
 *             - delivered
 *             - cancelled
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - paid
 *             - failed
 *             - refunded
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
orderAdminRouter.get(
  "/",
  validateRequest(getAllOrdersQueryValidationSchema),
  ordersController.getAllOrders,
);

// GET_ORDER_DETAILS ________________________________________________________________

/**
 * @swagger
 * /api/v1/admin/orders/{orderId}:
 *   get:
 *     summary: Get order details
 *     description: Retrieve complete details of a specific order.
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 */
orderAdminRouter.get(
  "/:orderId",
  validateRequest(adminOrderParamsValidationSchema),
  ordersController.getOrder,
);

// UPDATE_ORDER_STATUS ________________________________________________________________

/**
 * @swagger
 * /api/v1/admin/orders/{orderId}/status:
 *   patch:
 *     summary: Update order status
 *     description: Update the status of an order.
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *               - orderStatus
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - confirmed
 *                   - processing
 *                   - shipped
 *                   - delivered
 *                   - cancelled
 *                 example: processing
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 */
orderAdminRouter.patch(
  "/:orderId/status",
  validateRequest(adminOrderParamsValidationSchema),
  validateRequest(updateOrderStatusValidationSchema),
  ordersController.updateOrderStatus,
);

export default orderAdminRouter;
