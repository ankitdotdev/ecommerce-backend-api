import razorpay from "../../config/razorpay";
import { BadRequestError, NotFoundError } from "../../utils/errors/AppError";
import { Order } from "../orders/orders.model";

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

    console.log(process.env.RAZORPAY_KEY_ID);
    console.log(process.env.RAZORPAY_KEY_SECRET);
    const razorpayOrder = await razorpay.orders
      .create({
        amount: Math.round(order.totalAmount * 100),
        currency: "INR",
        receipt: order.orderNumber,
      })
      .catch((error) => {
        console.error("RAZORPAY_ORDER_CREATION_ERROR:", error);

        throw new BadRequestError("Failed to create Razorpay order");
      });

    console.log("RAZORPAY_ORDER_CREATED:", razorpayOrder.id);

    return {
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    };
  }
}

export default new PaymentServices();
