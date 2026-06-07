import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import wishlistServices from "./wishlist.services";

class WishlistController {
  // ADD_TO_WISHLIST ____________________________________

  addToWishlist = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await wishlistServices.addToWishlist(
          req.user?.userId as string,
          req.params.productId as string,
        );

        res.status(201).json({
          success: true,
          message: "Product added to wishlist successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // GET_WISHLIST ____________________________________

  getWishlist = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await wishlistServices.getWishlist(
          req.user?.userId as string,
        );

        res.status(200).json({
          success: true,
          message: "Wishlist retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // REMOVE_FROM_WISHLIST ____________________________________

  removeFromWishlist = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await wishlistServices.removeFromWishlist(
          req.user?.userId as string,
          req.params.productId as string,
        );

        res.status(200).json({
          success: true,
          message: "Product removed from wishlist successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // CLEAR_WISHLIST ____________________________________

  clearWishlist = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await wishlistServices.clearWishlist(
          req.user?.userId as string,
        );

        res.status(200).json({
          success: true,
          message: "Wishlist cleared successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new WishlistController();