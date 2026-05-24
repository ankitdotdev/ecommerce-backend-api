
// VERIFY OTP ___________________________________________

export const verifyOtpTemplate = (
  otp: string
) => {

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

export const forgotPasswordTemplate = (
  otp: string
) => {

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