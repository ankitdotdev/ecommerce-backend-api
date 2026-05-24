import emailService from "../../email.service";

import { forgotPasswordTemplate, verifyOtpTemplate } from "./auth-email.template";

class AuthEmailService {


// GENERATE OTP LOGIC ___________________________________________

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


// VERIFY OTP EMAIL ___________________________________________

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

// FORGET PASSWORD EMAIL  ____________________________________

  async sendForgotPasswordOtp(
  email: string,
  otp: string
) {

  await emailService.sendEmail({
    to: email,

    subject: "Reset Your Password",

    html: forgotPasswordTemplate(
      otp
    ),
  });
}
}

export default new AuthEmailService();