import { ISendEmailOptions } from "./email.interface";

import { config } from "../../config";
import { resend } from "./resend.config";

class EmailService {
  async sendEmail(options: ISendEmailOptions) {
    try {
      const response = await resend.emails.send({
        from: config.emailFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response;
    } catch (error) {
      console.log("EMAIL ERROR:", error);

      throw error;
    }
  }
}

export default new EmailService();
