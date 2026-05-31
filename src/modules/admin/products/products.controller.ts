import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import productServices from "./product.services";
import sendPaginatedResponse from "../../../utils/sendPaginatedResponse";

class ProductController {
  // CREATE_PRODUCT ____________________________________

  createProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await productServices.createProduct(
          req.body,
          req.user?.userId!,
        );

        res.status(201).json({
          success: true,
          message: "Product created successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // GET_ALL_PRODUCTS ___________________________________

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productServices.getAllProducts(req.query);

      sendPaginatedResponse(res, {
        statusCode: 200,
        message: "Products retrieved successfully",
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();
