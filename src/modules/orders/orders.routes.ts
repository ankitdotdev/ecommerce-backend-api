// POST   /api/v1/orders
// GET    /api/v1/orders
// GET    /api/v1/orders/:orderId
// PATCH  /api/v1/orders/:orderId/cancel
// GET /api/v1/orders/:orderId/invoice

import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/schemal.validator";
import {
  createOrderValidationSchema,
  generateInvoiceValidationSchema,
  orderParamsValidationSchema,
} from "./orders.schemas";
import ordersController from "./orders.controller";

const orderRouter = Router();

orderRouter.use(authMiddleware.auth);
orderRouter.use(authMiddleware.customer);

// CREATE_ORDER ________________________________________________________________

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create order
 *     description: Create a new order from the authenticated customer's cart using a selected shipping address.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *             properties:
 *               addressId:
 *                 type: string
 *                 description: ID of the shipping address to be used for the order
 *                 example: 685d67fd5dc89e17ca8474e8
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty or invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found or cart not found
 */
orderRouter.post(
  "/",
  validateRequest(createOrderValidationSchema),
  ordersController.createOrder,
);

// GET_MY_ORDERS ________________________________________________________________

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get my orders
 *     description: Retrieve all orders belonging to the authenticated customer.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 */
orderRouter.get("/", ordersController.getOrders);

// GET_ORDER_DETAILS ________________________________________________________________

/**
 * @swagger
 * /api/v1/orders/{orderId}:
 *   get:
 *     summary: Get order details
 *     description: Retrieve details of a specific order belonging to the authenticated customer.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
orderRouter.get(
  "/:orderId",
  validateRequest(orderParamsValidationSchema),
  ordersController.getOrder,
);

// CANCEL_ORDER ________________________________________________________________

/**
 * @swagger
 * /api/v1/orders/{orderId}/cancel:
 *   patch:
 *     summary: Cancel order
 *     description: Cancel an order if it is still eligible for cancellation.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Order cannot be cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
orderRouter.patch(
  "/:orderId/cancel",
  validateRequest(orderParamsValidationSchema),
  ordersController.cancelOrder,
);

// GENERATE_INVOICE_PDF ____________________________________________

/**
 * @swagger
 * /api/v1/orders/{orderId}/invoice:
 *   get:
 *     summary: Generate order invoice
 *     description: Generate and retrieve a PDF invoice for a paid order belonging to the authenticated customer. The generated invoice is uploaded to Cloudinary and the invoice URL is returned.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Invoice generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Invoice generated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                       example: 684f92c6b1d7e9c1d7f12345
 *                     orderNumber:
 *                       type: string
 *                       example: ORD-20260608-001
 *                     invoiceUrl:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/raw/upload/v1234567890/invoices/invoice.pdf
 *       400:
 *         description: Invoice is available only for paid orders
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order or payment details not found
 */
orderRouter.get(
  "/:orderId/invoice",
  validateRequest(generateInvoiceValidationSchema),
  ordersController.generateInvoice,
);
export default orderRouter;
