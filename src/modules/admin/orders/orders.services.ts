import { BadRequestError, NotFoundError } from "../../../utils/errors/AppError";
import { Order } from "../../orders/orders.model";


class OrderAdminServices {
  // GET_ALL_ORDERS ________________________________________________________________

  async getAllOrders(query: any) {
    const {
      page = 1,
      limit = 10,
      search,
      orderStatus,
      paymentStatus,
    } = query;

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
    orderStatus: string,
  ) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Prevent updates after cancellation
    if (order.orderStatus === "cancelled") {
      throw new BadRequestError(
        "Cancelled orders cannot be updated",
      );
    }

    // Prevent updates after delivery
    if (order.orderStatus === "delivered") {
      throw new BadRequestError(
        "Delivered orders cannot be updated",
      );
    }

    const validTransitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],

      confirmed: [
        "processing",
        "cancelled",
      ],

      processing: ["shipped"],

      shipped: ["delivered"],
    };

    const allowedStatuses =
      validTransitions[order.orderStatus] || [];

    if (
      !allowedStatuses.includes(orderStatus)
    ) {
      throw new BadRequestError(
        `Cannot change order status from ${order.orderStatus} to ${orderStatus}`,
      );
    }

    order.orderStatus = orderStatus as any;

    await order.save();

    return order;
  }
}

export default new OrderAdminServices();