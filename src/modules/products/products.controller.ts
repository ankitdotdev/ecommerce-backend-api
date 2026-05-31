import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendPaginatedResponse from "../../utils/sendPaginatedResponse";
import productsServices from "./products.services";

class ProductController {
  // GET_ALL_PRODUCTS ____________________________________

  getAllProducts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await productsServices.getAllProducts(req.query);

        sendPaginatedResponse(res, {
          statusCode: 200,
          message: "Products retrieved successfully",
          meta: result.meta,
          data: result.data,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // GET_PRODUCT_DETAILS ____________________________________

  getProductDetails = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await productsServices.getProductDetails(
          req.params.slug as string,
        );

        res.status(200).json({
          success: true,
          message: "Product retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new ProductController();
