import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import authServices from "./auth.services";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  resetTokenCookieOptions,
} from "../../config/cookies";

class AuthController {
  registerUser = catchAsync(async (req: Request, res: Response) => {
    const userData = req.body;

    const result = await authServices.registerUser(userData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  });

  // VERIFY OTP
  verifyOtp = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const result = await authServices.verifyOtp(email, otp);

    res.status(200).json({
      success: true,

      message: "OTP verified successfully",

      data: result,
    });
  });

  // RESEND OTP
  resendOtp = catchAsync(async (req: Request, res: Response) => {
    console.log("CONTROLLER: Resend OTP request received");

    const { email } = req.body;

    const result = await authServices.resendOtp(email);

    console.log("CONTROLLER: OTP resend completed");

    res.status(200).json({
      success: true,

      message: "OTP resent successfully",

      data: result,
    });
  });

  // LOGIN __________________________________

  loginUser = catchAsync(async (req: Request, res: Response) => {
    console.log("CONTROLLER: Login request received");

    const payload = req.body;

    const result = await authServices.loginUser(payload);

    // set access token cookie
    res.cookie(
      "accessToken",

      result.accessToken,

      accessTokenCookieOptions,
    );

    // set refresh token cookie
    res.cookie(
      "refreshToken",

      result.refreshToken,

      refreshTokenCookieOptions,
    );

    console.log("CONTROLLER: Auth cookies set");

    res.status(200).json({
      success: true,

      message: "Login successful",
    });
  });

  // FORGOT_PASSWORD ______________________________________
  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    console.log("CONTROLLER: Forgot password request received");

    const { email } = req.body;

    const result = await authServices.forgotPassword(email);

    console.log("CONTROLLER: Forgot password completed");

    res.status(200).json({
      success: true,

      message: "Password reset OTP sent successfully",

      data: result,
    });
  });

  // VERIFY_RESET_PASSWORD_OTP _________________________________________
  verifyResetOtp = catchAsync(async (req: Request, res: Response) => {
    console.log("CONTROLLER: Verify reset OTP request received");

    const payload = req.body;

    const result = await authServices.verifyResetOtp(payload);

    console.log("CONTROLLER: Reset OTP verified");

    // set secure reset token cookie
    res.cookie("resetToken", result.resetToken, resetTokenCookieOptions);

    res.status(200).json({
      success: true,

      message: "Reset OTP verified successfully",
    });
  });

  // RESET_PASSWORD _______________________________________

  resetPassword = catchAsync(async (req: Request, res: Response) => {
    console.log("CONTROLLER: Reset password request received");

    const { newPassword } = req.body;

    // read reset token from cookie
    const resetToken = req.cookies.resetToken;

    const result = await authServices.resetPassword({
      resetToken,

      newPassword,
    });

    console.log("CONTROLLER: Password reset completed");

    // clear reset token cookie
    res.clearCookie("resetToken");

    console.log("CONTROLLER: Reset token cookie cleared");

    res.status(200).json({
      success: true,

      message: "Password reset successful",

      data: result,
    });
  });

  // CHANGE_PASSWORD _______________________________________

  changePassword = catchAsync(async (req: Request, res: Response) => {
    console.log("CONTROLLER: Change password request received");

    const user = req.user;

    const payload = req.body;

    await authServices.changePassword(user, payload);

    console.log("CONTROLLER: Password changed successfully");

    res.status(200).json({
      success: true,

      message: "Password changed successfully",
    });
  });
}

export default new AuthController();
