import razorpay from "../../config/razorpay";
import { BadRequestError, NotFoundError } from "../../utils/errors/AppError";
import { Order } from "../orders/orders.model";
import { PaymentProvider, PaymentStatus } from "./payments.interface";
import Payment from "./payments.model";

class PaymentServices {
  // INITIATE_PAYMENT ____________________________________
  //
  // Edge Cases Covered:
  // - Order does not exist
  // - Order does not belong to user
  // - Order already paid
  // - Order is cancelled

  async initiatePayment(userId: string, orderId: string) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.user.toString() !== userId) {
      throw new NotFoundError("Order not found");
    }

    if (order.orderStatus === "cancelled") {
      throw new BadRequestError(
        "Cannot initiate payment for a cancelled order",
      );
    }

    if (order.paymentStatus === "paid") {
      throw new BadRequestError("Order has already been paid");
    }

    // Mock Razorpay Order
    const mockOrder = {
      id: `order_mock_${Date.now()}`,
      amount: Math.round(order.totalAmount * 100), // paise
      currency: "INR",
      receipt: order.orderNumber,
      status: "created",
    };

    return {
      orderId: order._id,
      razorpayOrderId: mockOrder.id,
      amount: mockOrder.amount,
      currency: mockOrder.currency,
      key: "rzp_test_mock_key",
      isMock: true,
    };
  }

  async verifyPayment(
    userId: string,
    payload: {
      orderId: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    },
  ) {
    const order = await Order.findById(payload.orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.user.toString() !== userId) {
      throw new NotFoundError("Order not found");
    }

    if (order.orderStatus === "cancelled") {
      throw new BadRequestError("Order has been cancelled");
    }

    if (order.paymentStatus === "paid") {
      throw new BadRequestError("Order has already been paid");
    }

    // TODO:
    // Verify Razorpay signature here

    const payment = await Payment.create({
      order: order._id,
      user: order.user,
      amount: order.totalAmount,
      provider: PaymentProvider.RAZORPAY,
      status: PaymentStatus.PAID,
      razorpayOrderId: payload.razorpayOrderId,
      razorpayPaymentId: payload.razorpayPaymentId,
      razorpaySignature: payload.razorpaySignature,
      paidAt: new Date(),
    });

    order.paymentStatus = "paid";

    if (order.orderStatus === "pending") {
      order.orderStatus = "confirmed";
    }

    await order.save();

    return {
      verified: true,
      paymentId: payment._id,
      orderId: order._id,
      paymentStatus: payment.status,
      orderStatus: order.orderStatus,
    };
  }

  // GET_PAYMENT ____________________________________
  //
  // Edge Cases Covered:
  // - Payment does not exist
  // - Payment does not belong to user

  async getPayment(userId: string, paymentId: string) {
    const payment = await Payment.findById(paymentId)
      .populate({
        path: "order",
        select: "orderNumber totalAmount orderStatus paymentStatus createdAt",
      })
      .lean();

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    if (payment.user.toString() !== userId) {
      throw new NotFoundError("Payment not found");
    }

    return payment;
  }

  // RECORD_PAYMENT_FAILURE ____________________________________
  //
  // Edge Cases Covered:
  // - Order does not exist
  // - Order does not belong to user
  // - Order already paid
  // - Order is cancelled
  // - Duplicate failed payment record

  async recordPaymentFailure(
    userId: string,
    payload: {
      orderId: string;
      razorpayOrderId: string;
      errorCode?: string;
      errorDescription?: string;
      errorSource?: string;
      errorStep?: string;
      errorReason?: string;
    },
  ) {
    const order = await Order.findById(payload.orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.user.toString() !== userId) {
      throw new NotFoundError("Order not found");
    }

    if (order.orderStatus === "cancelled") {
      throw new BadRequestError(
        "Cannot record payment failure for a cancelled order",
      );
    }

    if (order.paymentStatus === "paid") {
      throw new BadRequestError(
        "Cannot record payment failure for a paid order",
      );
    }

    const existingPayment = await Payment.findOne({
      razorpayOrderId: payload.razorpayOrderId,
      status: PaymentStatus.FAILED,
    });

    if (existingPayment) {
      throw new BadRequestError("Failed payment has already been recorded");
    }

    const payment = await Payment.create({
      order: order._id,
      user: order.user,
      amount: order.totalAmount,
      provider: PaymentProvider.RAZORPAY,
      status: PaymentStatus.FAILED,
      razorpayOrderId: payload.razorpayOrderId,
    });

    // Allow customer to retry payment on the same order
    order.paymentStatus = "failed";

    // Reset order back to pending unless already delivered
    if (order.orderStatus !== "delivered") {
      order.orderStatus = "pending";
    }

    await order.save();

    return {
      paymentId: payment._id,
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      retryAllowed: true,
    };
  }
}

export default new PaymentServices();
