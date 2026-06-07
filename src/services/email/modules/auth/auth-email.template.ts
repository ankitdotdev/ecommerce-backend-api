// VERIFY OTP ___________________________________________

export const verifyOtpTemplate = (otp: string) => {
  return `
    <div>
      <h2>Email Verification</h2>

      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>
        This OTP will expire in 5 minutes.
      </p>
    </div>
  `;
};

// FORGET PASSWORD  ____________________________________

export const forgotPasswordTemplate = (otp: string) => {
  return `
    <div>
      <h2>Password Reset Request</h2>

      <p>
        Use the OTP below to reset your password:
      </p>

      <h1>${otp}</h1>

      <p>
        This OTP will expire in 5 minutes.
      </p>

      <p>
        If you did not request this,
        please ignore this email.
      </p>
    </div>
  `;
};

// WELCOME EMAIL ________________________________________

export const welcomeUserTemplate = (companyName: string, userName: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      
      <h1>Welcome to ${companyName}!!!</h1>

      <p>Hi ${userName},</p>

      <p>
        Thank you for creating your account with
        <strong>${companyName}</strong>.
      </p>

      <p>
        We're excited to have you as part of our community.
      </p>

      <p>
        Before you get started, please verify your email address
        using the OTP we have sent separately.
      </p>

      <p>
        Once verified, you'll be able to:
      </p>

      <ul>
        <li>Browse our latest products</li>
        <li>Track your orders</li>
        <li>Manage your account</li>
        <li>Enjoy exclusive offers and discounts</li>
      </ul>

      <p>
        We look forward to serving you.
      </p>

      <p>
        Happy Shopping!
      </p>

      <br />

      <p>
        Regards,<br />
        Team ${companyName}
      </p>

    </div>
  `;
};
