import { NextFunction, Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import cartServices from "./cart.services";

class CartController {
  // GET_CART ____________________________________

  getCart = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await cartServices.getCart(req.user?.userId! as string);

        res.status(200).json({
          success: true,
          message: "Cart retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // ADD_TO_CART ____________________________________

  addToCart = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await cartServices.addToCart(
          req.user?.userId! as string,
          req.body,
        );

        res.status(200).json({
          success: true,
          message: "Product added to cart successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // UPDATE_CART_ITEM ____________________________________

  updateCartItem = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await cartServices.updateCartItem(
          req.user?.userId! as string,
          req.params.productId as string,
          req.body.quantity,
        );

        res.status(200).json({
          success: true,
          message: "Cart item updated successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // REMOVE_CART_ITEM ____________________________________

  removeCartItem = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await cartServices.removeCartItem(
          req.user?.userId! as string,
          req.params.productId as string,
        );

        res.status(200).json({
          success: true,
          message: "Product removed from cart successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // CLEAR_CART ____________________________________

  clearCart = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await cartServices.clearCart(
          req.user?.userId! as string,
        );

        res.status(200).json({
          success: true,
          message: "Cart cleared successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new CartController();
