import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import ordersServices from "./orders.services";

class OrderAdminController {
  // GET_ALL_ORDERS ________________________________________________________________

  getAllOrders = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ordersServices.getAllOrders(req.query);

        res.status(200).json({
          success: true,
          message: "Orders retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // GET_ORDER ________________________________________________________________

  getOrder = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ordersServices.getOrder(
          req.params.orderId as string,
        );

        res.status(200).json({
          success: true,
          message: "Order retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // UPDATE_ORDER_STATUS ________________________________________________________________

  updateOrderStatus = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { orderId } = req.params;

        const { orderStatus, note } = req.body;

        const adminId = req.user?.userId as string;

        const result = await ordersServices.updateOrderStatus(
          orderId as string,
          adminId,
          orderStatus,
          note,
        );

        res.status(200).json({
          success: true,

          message: "Order status updated successfully",

          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new OrderAdminController();
