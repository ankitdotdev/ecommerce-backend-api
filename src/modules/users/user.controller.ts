import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import userServices from "./user.services";

class UserController {
  // GET_ME ____________________________________

  getMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await userServices.getMe(req.user?.userId as string);

        res.status(200).json({
          success: true,
          message: "Profile retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new UserController();
