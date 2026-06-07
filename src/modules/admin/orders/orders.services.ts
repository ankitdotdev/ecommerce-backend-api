import mongoose, { Types } from "mongoose";
import { BadRequestError, NotFoundError } from "../../../utils/errors/AppError";
import { Order } from "../../orders/orders.model";

class OrderAdminServices {
  // GET_ALL_ORDERS ________________________________________________________________

  async getAllOrders(query: any) {
    const { page = 1, limit = 10, search, orderStatus, paymentStatus } = query;

    const filter: Record<string, any> = {};

    if (search) {
      filter.orderNumber = {
        $regex: search,
        $options: "i",
      };
    }

    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .select(
          "_id orderNumber totalAmount orderStatus paymentStatus createdAt",
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Order.countDocuments(filter),
    ]);

    return {
      orders,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // GET_ORDER ________________________________________________________________

  async getOrder(orderId: string) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    return order;
  }

  // UPDATE_ORDER_STATUS ________________________________________________________________

  async updateOrderStatus(
    orderId: string,
    adminId: string,
    orderStatus:
      | "confirmed"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled",
    note?: string,
  ) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Prevent updates after cancellation
    if (order.orderStatus === "cancelled") {
      throw new BadRequestError("Cancelled orders cannot be updated");
    }

    // Prevent updates after delivery
    if (order.orderStatus === "delivered") {
      throw new BadRequestError("Delivered orders cannot be updated");
    }

    const validTransitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],

      confirmed: ["processing", "cancelled"],

      processing: ["shipped"],

      shipped: ["delivered"],
    };

    const allowedStatuses = validTransitions[order.orderStatus] || [];

    if (!allowedStatuses.includes(orderStatus)) {
      throw new BadRequestError(
        `Cannot change order status from ${order.orderStatus} to ${orderStatus}`,
      );
    }

    const previousStatus = order.orderStatus;

    order.orderStatus = orderStatus as any;

    // STATUS_HISTORY ________________________________________________

    order.statusHistory = order.statusHistory || [];

    order.statusHistory.push({
      status: orderStatus,

      note,

      updatedBy: new mongoose.Types.ObjectId(adminId),

      updatedAt: new Date(),
    });

    await order.save();

    switch (orderStatus) {
      case "confirmed":
        // ORDER_CONFIRMED_EMAIL ________________________________________________

        break;

      case "processing":
        // ORDER_PROCESSING_EMAIL ________________________________________________

        break;

      case "shipped":
        // ORDER_SHIPPED_EMAIL ________________________________________________

        break;

      case "delivered":
        // ORDER_DELIVERED_EMAIL ________________________________________________

        break;

      case "cancelled":
        // ORDER_CANCELLED_EMAIL ________________________________________________

        break;
    }

    return {
      order,

      previousStatus,

      currentStatus: orderStatus,

      note,

      updatedBy: adminId,
    };
  }
}

export default new OrderAdminServices();
