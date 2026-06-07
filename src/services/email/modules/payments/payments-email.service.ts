import { config } from "../../../../config";
import emailService from "../../email.service";
import { paymentSuccessAdminTemplate, paymentSuccessUserTemplate } from "./payments-email.template";



class PaymentEmailService {
  // USER EMAIL _______________________________________

  async sendPaymentSuccessToUser({
    email,
    customerName,
    orderNumber,
    amount,
  }: {
    email: string;
    customerName: string;
    orderNumber: string;
    amount: number;
  }) {
    await emailService.sendEmail({
      to: email,

      subject: `Payment Received - Order Confirmed 🎉`,

      html: paymentSuccessUserTemplate({
        companyName: config.companyName,
        customerName,
        orderNumber,
        amount,
      }),
    });
  }

  // ADMIN EMAIL _______________________________________

  async sendPaymentSuccessToAdmin({
    customerName,
    customerEmail,
    orderNumber,
    amount,
  }: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    amount: number;
  }) {
    await emailService.sendEmail({
      to: config.adminEmail,

      subject: `Payment Received - ${orderNumber}`,

      html: paymentSuccessAdminTemplate({
        customerName,
        customerEmail,
        orderNumber,
        amount,
      }),
    });
  }
}

export default new PaymentEmailService();