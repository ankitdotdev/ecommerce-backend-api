import { NextFunction, Request, Response } from "express";

import catchAsync from "../../../utils/catchAsync";
import reviewServices from "./reviews.services";

class ReviewsController {
  // GET_REVIEWS ____________________________________

  getReviews = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await reviewServices.getReviews(req.query);

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

  // GET_REVIEW_BY_ID ____________________________________

  getReviewById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await reviewServices.getReviewById(
          req.params.reviewId as string,
        );

        res.status(200).json({
          success: true,
          message: "Review retrieved successfully",
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
        const result = await reviewServices.deleteReview(
          req.user?.userId as string,
          req.params.reviewId as string,
          req.body.reason as string,
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