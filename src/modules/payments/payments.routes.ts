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
import { initiatePaymentValidationSchema } from "./payments.schema";
import paymentsController from "./payments.controller";


const paymentRouter = Router();

paymentRouter.use(authMiddleware.auth);
paymentRouter.use(authMiddleware.customer);

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

export default paymentRouter;