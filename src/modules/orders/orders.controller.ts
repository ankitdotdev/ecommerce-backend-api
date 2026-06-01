import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import ordersServices from "./orders.services";

class OrderController {
  // CREATE_ORDER ________________________________________________________________

  createOrder = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ordersServices.createOrder(
          req.user?.userId!,
          req.body.addressId,
        );

        res.status(201).json({
          success: true,
          message: "Order created successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // GET_ORDERS ________________________________________________________________

  getOrders = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ordersServices.getOrders(req.user?.userId!);

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
          req.user?.userId!,
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

  // CANCEL_ORDER ________________________________________________________________

  cancelOrder = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await ordersServices.cancelOrder(
          req.user?.userId!,
          req.params.orderId as string,
        );

        res.status(200).json({
          success: true,
          message: "Order cancelled successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new OrderController();
