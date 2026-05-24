import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import authServices from "./auth.services";

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
}

export default new AuthController();
