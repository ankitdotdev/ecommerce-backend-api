import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import reviewsServices from "./reviews.services";

class ReviewsController {
  // CREATE_REVIEW ____________________________________

  createReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await reviewsServices.createReview(
          req.user?.userId as string,
          req.params.productId as string,
          req.body,
        );

        res.status(201).json({
          success: true,
          message: "Review submitted successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // GET_PRODUCT_REVIEWS ____________________________________

  getProductReviews = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await reviewsServices.getProductReviews(
          req.params.productId as string,
          req.query,
        );

        res.status(200).json({
          success: true,
          message: "Reviews retrieved successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // UPDATE_REVIEW ____________________________________

  updateReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await reviewsServices.updateReview(
          req.user?.userId as string,
          req.params.reviewId as string,
          req.body,
        );

        res.status(200).json({
          success: true,
          message: "Review updated successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // DELETE_REVIEW ____________________________________

  deleteReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await reviewsServices.deleteReview(
          req.user?.userId as string,
          req.params.reviewId as string,
        );

        res.status(200).json({
          success: true,
          message: "Review deleted successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },
  );
}

export default new ReviewsController();
