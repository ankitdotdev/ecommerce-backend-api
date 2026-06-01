import { Address } from "../address/address.model";

import { BadRequestError, NotFoundError } from "../../utils/errors/AppError";
import { Cart } from "../cart/cart.module";
import { Order } from "./orders.model";

class OrderServices {
  // CREATE_ORDER ________________________________________________________________

  async createOrder(userId: string, addressId: string) {
    // Validate Address
    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      throw new NotFoundError("Address not found");
    }

    // Validate Cart
    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    if (!cart.items.length) {
      throw new BadRequestError("Cart is empty");
    }

    // Create Order Items Snapshot
    const items = cart.items.map((item: any) => ({
      product: item.product._id,

      name: item.product.name,

      slug: item.product.slug,

      image: item.product.images?.[item.product.thumbnailIndex] || "",

      price: item.product.price,

      quantity: item.quantity,

      subtotal: item.product.price * item.quantity,
    }));

    // Calculate Totals
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Generate Order Number
    const orderNumber = `ORD-${Date.now()}`;

    // Create Order
    const order = await Order.create({
      user: userId,

      orderNumber,

      items,

      shippingAddress: {
        addressLine1: address.addressLine1,

        addressLine2: address.addressLine2,

        landmark: address.landmark,

        city: address.city,

        state: address.state,

        country: address.country,

        postalCode: address.postalCode,

        latitude: address.latitude,

        longitude: address.longitude,
      },

      subtotal,

      totalAmount: subtotal,

      orderStatus: "pending",

      paymentStatus: "pending",
    });

    // Clear Cart After Successful Order Creation
    cart.items = [];

    await cart.save();

    return order;
  }

  // GET_ORDERS ________________________________________________________________

  async getOrders(userId: string) {
    const orders = await Order.find({
      user: userId,
    })
      .select("_id orderNumber totalAmount orderStatus paymentStatus createdAt")
      .sort({
        createdAt: -1,
      });

    return orders;
  }

  // GET_ORDER ________________________________________________________________

  async getOrder(userId: string, orderId: string) {
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    return order;
  }

  // CANCEL_ORDER ________________________________________________________________

  async cancelOrder(userId: string, orderId: string) {
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Allow Cancellation Only Before Processing Starts
    const cancellableStatuses = ["pending", "confirmed"];

    if (!cancellableStatuses.includes(order.orderStatus)) {
      throw new BadRequestError("This order can no longer be cancelled");
    }

    order.orderStatus = "cancelled";

    await order.save();

    return order;
  }
}

export default new OrderServices();
