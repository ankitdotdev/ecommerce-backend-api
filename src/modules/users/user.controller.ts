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

  // UPDATE_ME ____________________________________

  updateMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await userServices.updateMe(
          req.user?.userId as string,
          req.body,
        );

        res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // UPDATE_AVATAR ____________________________________

  updateAvatar = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await userServices.updateAvatar(
          req.user?.userId as string,
          req.file,
        );

        res.status(200).json({
          success: true,
          message: "Avatar updated successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // DELETE_AVATAR ____________________________________

  deleteAvatar = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await userServices.deleteAvatar(
          req.user?.userId as string,
        );

        res.status(200).json({
          success: true,
          message: "Avatar removed successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new UserController();
