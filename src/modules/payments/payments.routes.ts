// POST /api/v1/payments/:orderId/initiate
// (Creates a Razorpay payment order for an existing order and returns checkout configuration)

// POST /api/v1/payments/verify
// (Verifies Razorpay payment signature and marks payment/order as successful)

// GET /api/v1/payments/:paymentId
// (Retrieves complete payment details for a specific payment)

// POST /api/v1/payments/failure
// (Records a failed payment attempt and updates payment status with failure details)

import { Router } from "express";

import validateRequest from "../../middleware/schemal.validator";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getPaymentValidationSchema,
  initiatePaymentValidationSchema,
  recordPaymentFailureValidationSchema,
  verifyPaymentValidationSchema,
} from "./payments.schema";
import paymentsController from "./payments.controller";

const paymentRouter = Router();

paymentRouter.use(authMiddleware.auth);
paymentRouter.use(authMiddleware.customer);

/**
 * @swagger
 * /api/v1/payments/{paymentId}:
 *   get:
 *     summary: Get payment details
 *     description: Retrieve complete details of a specific payment belonging to the authenticated customer.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
paymentRouter.get(
  "/:paymentId",
  validateRequest(getPaymentValidationSchema),
  paymentsController.getPayment,
);

/**
 * @swagger
 * /api/v1/payments/{orderId}/initiate:
 *   post:
 *     summary: Initiate payment
 *     description: Create a Razorpay payment order for an existing order and return checkout details.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Payment initiated successfully
 *       404:
 *         description: Order not found
 */
paymentRouter.post(
  "/:orderId/initiate",
  validateRequest(initiatePaymentValidationSchema),
  paymentsController.initiatePayment,
);

/**
 * @swagger
 * /api/v1/payments/verify:
 *   post:
 *     summary: Verify payment
 *     description: Verifies the payment signature returned by Razorpay and updates the corresponding order payment status.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - razorpayOrderId
 *               - razorpayPaymentId
 *               - razorpaySignature
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 665f3f8e4b7d8e6c7f123456
 *               razorpayOrderId:
 *                 type: string
 *                 example: order_Qwerty123456
 *               razorpayPaymentId:
 *                 type: string
 *                 example: pay_AbCdEfGhIjKlMn
 *               razorpaySignature:
 *                 type: string
 *                 example: 9f4a6d5e7b8c1a2f3d4e5c6b7a8f9d0e
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Invalid payment details or signature
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
paymentRouter.post(
  "/verify",
  validateRequest(verifyPaymentValidationSchema),
  paymentsController.verifyPayment,
);

/**
 * @swagger
 * /api/v1/payments/failure:
 *   post:
 *     summary: Record failed payment
 *     description: Records a failed payment attempt and updates payment status with failure details.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - razorpayOrderId
 *             properties:
 *               orderId:
 *                 type: string
 *               razorpayOrderId:
 *                 type: string
 *               errorCode:
 *                 type: string
 *               errorDescription:
 *                 type: string
 *               errorSource:
 *                 type: string
 *               errorStep:
 *                 type: string
 *               errorReason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Failed payment recorded successfully
 *       404:
 *         description: Order not found
 */
paymentRouter.post(
  "/failure",
  validateRequest(recordPaymentFailureValidationSchema),
  paymentsController.recordPaymentFailure,
);

export default paymentRouter;
