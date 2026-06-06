import { NextFunction, Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import paymentsServices from "./payments.services";

class PaymentController {
  // INITIATE_PAYMENT ____________________________________

  initiatePayment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await paymentsServices.initiatePayment(
          req.user?.userId! as string,
          req.params.orderId as string,
        );

        res.status(201).json({
          success: true,
          message: "Payment initiated successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // VERIFY_PAYMENT ____________________________________

  verifyPayment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await paymentsServices.verifyPayment(
          req.user?.userId! as string,
          req.body,
        );

        res.status(200).json({
          success: true,
          message: "Payment verified successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // GET_PAYMENT ____________________________________

  getPayment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await paymentsServices.getPayment(
          req.user?.userId! as string,
          req.params.paymentId as string,
        );

        res.status(200).json({
          success: true,
          message: "Payment details retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // RECORD_PAYMENT_FAILURE ____________________________________

  recordPaymentFailure = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await paymentsServices.recordPaymentFailure(
          req.user?.userId! as string,
          req.body,
        );

        res.status(201).json({
          success: true,
          message: "Failed payment recorded successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new PaymentController();
