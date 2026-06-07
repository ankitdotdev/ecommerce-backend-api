import { BadRequestError, NotFoundError } from "../../utils/errors/AppError";
import { Order } from "../orders/orders.model";
import { Product } from "../products/products.model";
import Review from "./reviews.model";

class ReviewsServices {
  // CREATE_REVIEW ____________________________________
  //
  // Edge Cases Covered:
  // - Product does not exist
  // - Product is deleted
  // - User has not purchased product
  // - Product order not delivered
  // - User already reviewed product

  async createReview(
    userId: string,
    productId: string,
    payload: {
      rating: number;
      title?: string;
      comment: string;
    },
  ) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const hasPurchased = await Order.exists({
      user: userId,
      orderStatus: "delivered",
      "items.product": product._id,
    });

    if (!hasPurchased) {
      throw new BadRequestError(
        "You can only review products you have purchased",
      );
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
      isDeleted: false,
    });

    if (existingReview) {
      throw new BadRequestError("You have already reviewed this product");
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating: payload.rating,
      title: payload.title,
      comment: payload.comment,
    });

    return review;
  }

  // GET_PRODUCT_REVIEWS ____________________________________
  //
  // Edge Cases Covered:
  // - Product does not exist
  // - No reviews found
  // - Pagination
  // - Rating aggregation

  async getProductReviews(
    productId: string,
    query: {
      page?: number;
      limit?: number;
      sortOrder?: "asc" | "desc";
    },
  ) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortOrder = query.sortOrder === "asc" ? 1 : -1;

    const [reviews, total, ratingStats] = await Promise.all([
      Review.find({
        product: productId,
        isDeleted: false,
      })
        .populate("user", "name avatar")
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit),

      Review.countDocuments({
        product: productId,
        isDeleted: false,
      }),

      Review.aggregate([
        {
          $match: {
            product: product._id,
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating",
            },
            reviewCount: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      averageRating: ratingStats[0]?.averageRating ?? 0,

      reviewCount: ratingStats[0]?.reviewCount ?? 0,

      reviews,
    };
  }

  // UPDATE_REVIEW ____________________________________
  //
  // Edge Cases Covered:
  // - Review does not exist
  // - Review deleted
  // - User does not own review
  // - Empty update payload

  async updateReview(
    userId: string,
    reviewId: string,
    payload: {
      rating?: number;
      title?: string;
      comment?: string;
    },
  ) {
    if (Object.keys(payload).length === 0) {
      throw new BadRequestError("At least one field is required for update");
    }

    const review = await Review.findOne({
      _id: reviewId,
      isDeleted: false,
    });

    console.log("Review we get", review);
    console.log("User ID", userId);
    console.log("Review ID", reviewId);

    if (!review) {
      throw new NotFoundError("Review not found");
    }

    if (review.user.toString() !== userId) {
      throw new NotFoundError("Review not found");
    }

    if (payload.rating !== undefined) {
      review.rating = payload.rating;
    }

    if (payload.title !== undefined) {
      review.title = payload.title;
    }

    if (payload.comment !== undefined) {
      review.comment = payload.comment;
    }

    await review.save();

    return review;
  }

  // DELETE_REVIEW ____________________________________
  //
  // Edge Cases Covered:
  // - Review does not exist
  // - Review already deleted
  // - User does not own review

  async deleteReview(userId: string, reviewId: string) {
    const review = await Review.findOne({
      _id: reviewId,
      isDeleted: false,
    });

    if (!review) {
      throw new NotFoundError("Review not found");
    }

    if (review.user.toString() !== userId) {
      throw new NotFoundError("Review not found");
    }

    review.isDeleted = true;

    review.deletedAt = new Date();

    review.deletedBy = review.user;

    review.deletedReason = "Deleted by customer";

    await review.save();

    return {
      reviewId: review._id,
      deleted: true,
      deletedAt: review.deletedAt,
    };
  }
}

export default new ReviewsServices();
