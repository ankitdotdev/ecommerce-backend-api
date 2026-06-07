import { config } from "../../../../config";
import emailService from "../../email.service";
import {
  orderReceivedAdminTemplate,
  orderReceivedTemplate,
  orderStatusUpdateTemplate,
} from "./order-email.template";

class OrderEmailService {
  // SEND_ORDER_RECEIVE_EMAIL _____________________________________________ (To User)

  async sendOrderReceivedEmail({
    email,
    customerName,
    companyName,
    orderNumber,
    totalAmount,
  }: {
    email: string;
    customerName: string;
    companyName: string;
    orderNumber: string;
    totalAmount: number;
  }) {
    await emailService.sendEmail({
      to: email,

      subject: `We've Received Your Order - Payment Pending`,

      html: orderReceivedTemplate({
        companyName,
        customerName,
        orderNumber,
        totalAmount,
      }),
    });
  }

  async sendOrderReceivedAdminEmail({
    customerName,
    customerEmail,
    orderNumber,
    totalAmount,
  }: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    totalAmount: number;
  }) {
    await emailService.sendEmail({
      to: config.adminEmail,

      subject: `New Order Received - ${orderNumber}`,

      html: orderReceivedAdminTemplate({
        customerName,
        customerEmail,
        orderNumber,
        totalAmount,
      }),
    });
  }

  // ORDER_CONFIRMED_EMAIL ________________________________________________

  async sendOrderConfirmedEmail({
    email,
    customerName,
    orderNumber,
    note,
  }: {
    email: string;
    customerName: string;
    orderNumber: string;
    note?: string;
  }) {
    await emailService.sendEmail({
      to: email,

      subject: `Order Confirmed - ${orderNumber}`,

      html: orderStatusUpdateTemplate({
        companyName: config.companyName,
        customerName,
        orderNumber,
        status: "confirmed",
        message: "✅ Your Order Has Been Confirmed",
        note,
      }),
    });
  }

  // ORDER_PROCESSING_EMAIL ________________________________________________

  async sendOrderProcessingEmail({
    email,
    customerName,
    orderNumber,
    note,
  }: {
    email: string;
    customerName: string;
    orderNumber: string;
    note?: string;
  }) {
    await emailService.sendEmail({
      to: email,

      subject: `Order Processing - ${orderNumber}`,

      html: orderStatusUpdateTemplate({
        companyName: config.companyName,
        customerName,
        orderNumber,
        status: "processing",
        message: "📦 We're Preparing Your Order",
        note,
      }),
    });
  }

  // ORDER_SHIPPED_EMAIL ________________________________________________

  async sendOrderShippedEmail({
    email,
    customerName,
    orderNumber,
    note,
  }: {
    email: string;
    customerName: string;
    orderNumber: string;
    note?: string;
  }) {
    await emailService.sendEmail({
      to: email,

      subject: `Order Shipped - ${orderNumber}`,

      html: orderStatusUpdateTemplate({
        companyName: config.companyName,
        customerName,
        orderNumber,
        status: "shipped",
        message: "🚚 Your Order Is On The Way",
        note,
      }),
    });
  }

  // ORDER_DELIVERED_EMAIL ________________________________________________

  async sendOrderDeliveredEmail({
    email,
    customerName,
    orderNumber,
    note,
  }: {
    email: string;
    customerName: string;
    orderNumber: string;
    note?: string;
  }) {
    await emailService.sendEmail({
      to: email,

      subject: `Order Delivered - ${orderNumber}`,

      html: orderStatusUpdateTemplate({
        companyName: config.companyName,
        customerName,
        orderNumber,
        status: "delivered",
        message: "🎉 Your Order Has Been Delivered",
        note,
      }),
    });
  }

  // ORDER_CANCELLED_EMAIL ________________________________________________

  async sendOrderCancelledEmail({
    email,
    customerName,
    orderNumber,
    note,
  }: {
    email: string;
    customerName: string;
    orderNumber: string;
    note?: string;
  }) {
    await emailService.sendEmail({
      to: email,

      subject: `Order Cancelled - ${orderNumber}`,

      html: orderStatusUpdateTemplate({
        companyName: config.companyName,
        customerName,
        orderNumber,
        status: "cancelled",
        message: "❌ Your Order Has Been Cancelled",
        note,
      }),
    });
  }
}

export default new OrderEmailService();
