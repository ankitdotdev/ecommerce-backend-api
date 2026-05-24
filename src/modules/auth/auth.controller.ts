import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import authServices from "./auth.services";

class AuthController {

  registerUser = catchAsync(
    async (req: Request, res: Response) => {

      const userData = req.body;

      const result =
        await authServices.registerUser(userData);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    }
  );

}

export default new AuthController();