import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../../config/cookies";
import catchAsync from "../../../utils/catchAsync";
import { Request, Response } from "express";
import authServices from "./auth.services";

class AuthController {
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
}

export default new AuthController();
