import emailService from "../../email.service";

import { verifyOtpTemplate } from "./auth-email.template";

class AuthEmailService {

  generateOtp() {

    return Math.floor(
      100000 + Math.random() * 900000
    ).toString();
  }

  generateOtpExpiry() {

    return new Date(
      Date.now() + 5 * 60 * 1000
    );
  }

  async sendVerificationOtp(
    email: string,
    otp: string
  ) {

    await emailService.sendEmail({
      to: email,

      subject: "Verify Your Email",

      html: verifyOtpTemplate(otp),
    });
  }
}

export default new AuthEmailService();