import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import productServices from "./product.services";

class ProductController {
  createProduct = catchAsync(async (req: Request, res: Response) => {
    
    const result = await productServices.createProduct(
      req.body,
      req.user?.userId!,
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  });
}

export default new ProductController();
