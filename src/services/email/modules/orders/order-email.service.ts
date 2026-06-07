import { config } from "../../../../config";
import emailService from "../../email.service";
import {
  orderReceivedAdminTemplate,
  orderReceivedTemplate,
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
}

export default new OrderEmailService();
