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
 *     description: Update the status of an order and optionally provide a note that will be visible in the order timeline and customer notifications.
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
 *         example: 6843f5d8a12c9f7e8b123456
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
 *                   - confirmed
 *                   - processing
 *                   - shipped
 *                   - delivered
 *                   - cancelled
 *               note:
 *                 type: string
 *                 description: Optional note related to the status update.
 *           examples:
 *             confirmed:
 *               summary: Confirm Order
 *               value:
 *                 orderStatus: confirmed
 *                 note: Payment verified successfully
 *
 *             processing:
 *               summary: Start Processing
 *               value:
 *                 orderStatus: processing
 *                 note: Order packed and assigned to warehouse team
 *
 *             shipped:
 *               summary: Ship Order
 *               value:
 *                 orderStatus: shipped
 *                 note: BlueDart Tracking Number BD123456
 *
 *             delivered:
 *               summary: Mark Delivered
 *               value:
 *                 orderStatus: delivered
 *                 note: Delivered to customer successfully
 *
 *             cancelled:
 *               summary: Cancel Order
 *               value:
 *                 orderStatus: cancelled
 *                 note: Product out of stock
 *
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Order status updated successfully
 *                   data:
 *                     previousStatus: confirmed
 *                     currentStatus: processing
 *                     note: Order packed and assigned to warehouse team
 *
 *       400:
 *         description: Invalid order status transition
 *
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
