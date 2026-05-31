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

  // UPDATE_PRODUCTS ___________________________________
  updateProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await productServices.updateProduct(
          req.params.productId as string,
          req.body,
          req.user?.userId!,
        );

        res.status(200).json({
          success: true,
          message: "Product updated successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );
  // GET_PRODUCT_DETAILS _____________________________________________

  getProductDetails = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await productServices.getProductDetails(
          req.params.productId as string,
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

  // DELETE_PRODUCT ____________________________________________________

  deleteProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await productServices.deleteProduct(
          req.params.productId as string,
          req.user?.userId!,
          req.body.reason,
        );

        res.status(200).json({
          success: true,
          message: "Product deleted successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // DELETE_PRODUCT_IMAGE _____________________________________________
  deleteProductImage = catchAsync(async (req, res, next) => {
    try {
      await productServices.deleteProductImage(
        req.params.id as string,
        req.body.imageUrl,
      );

      res.status(200).json({
        success: true,
        message: "Product image deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  });
}

export default new ProductController();
