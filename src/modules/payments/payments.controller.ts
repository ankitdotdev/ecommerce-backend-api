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
}

export default new PaymentController();