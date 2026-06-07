import { BadRequestError, NotFoundError } from "../../../utils/errors/AppError";
import Review from "../../reviews/reviews.model";

class ReviewServices {
  // GET_REVIEWS ____________________________________
  //
  // Edge Cases Covered:
  // - No reviews found
  // - Search by product title
  // - Search by user name
  // - Filter by rating
  // - Pagination
  // - Sorting

  async getReviews(query: {
    page?: number;
    limit?: number;
    search?: string;
    rating?: number;
    sortBy?: "rating" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      isDeleted: false,
    };

    if (query.rating) {
      filter.rating = query.rating;
    }

    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;

    let reviewsQuery = Review.find(filter)
      .populate("user", "name email")
      .populate("product", "name slug")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const reviews = await reviewsQuery;

    let filteredReviews = reviews;

    if (query.search) {
      const search = query.search.toLowerCase();

      filteredReviews = reviews.filter((review: any) => {
        const userName = review.user?.name?.toLowerCase() || "";

        const productName = review.product?.name?.toLowerCase() || "";

        return userName.includes(search) || productName.includes(search);
      });
    }

    const total = await Review.countDocuments(filter);

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: filteredReviews,
    };
  }

  // GET_REVIEW_BY_ID ____________________________________
  //
  // Edge Cases Covered:
  // - Review does not exist
  // - Review deleted

  async getReviewById(reviewId: string) {
    const review = await Review.findOne({
      _id: reviewId,
      isDeleted: false,
    })
      .populate("user", "name email")
      .populate("product", "name slug");

    if (!review) {
      throw new NotFoundError("Review not found");
    }

    return review;
  }

  // DELETE_REVIEW ____________________________________
  //
  // Edge Cases Covered:
  // - Review does not exist
  // - Review already deleted
  // - Missing deletion reason

  async deleteReview(adminId: string, reviewId: string, reason: string) {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new NotFoundError("Review not found");
    }

    if (review.isDeleted) {
      throw new BadRequestError("Review has already been deleted");
    }

    review.isDeleted = true;

    review.deletedAt = new Date();

    review.deletedBy = adminId as any;

    review.deletedReason = reason;

    await review.save();

    return {
      reviewId: review._id,
      deleted: true,
      deletedAt: review.deletedAt,
      deletedReason: review.deletedReason,
    };
  }
}

export default new ReviewServices();
