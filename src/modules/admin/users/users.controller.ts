import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import usersServices from "./users.services";

class UserController {
  // GET_USERS ____________________________________

  getUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await usersServices.getUsers(req.query);

        res.status(200).json({
          success: true,
          message: "Users retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // GET_USER_BY_ID ____________________________________

  getUserById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await usersServices.getUserById(
          req.params.userId as string,
        );

        res.status(200).json({
          success: true,
          message: "User retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // BLOCK_USER ____________________________________

  blockUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await usersServices.blockUser(
          req.params.userId as string,
          req.body.reason,
        );

        res.status(200).json({
          success: true,
          message: "User blocked successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // UNBLOCK_USER ____________________________________

  unblockUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await usersServices.unblockUser(
          req.params.userId as string,
        );

        res.status(200).json({
          success: true,
          message: "User unblocked successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // GET_USER_STATS ____________________________________

  getUserStats = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await usersServices.getUserStats();

        res.status(200).json({
          success: true,
          message: "User statistics retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new UserController();
