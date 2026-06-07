import z from "zod";

// CREATE_REVIEW ____________________________________

export const createReviewValidationSchema = z.object({
  params: z.object({
    productId: z.string().trim().min(1, "Product ID is required"),
  }),

  body: z.object({
    rating: z
      .number()
      .int()
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),

    title: z
      .string()
      .trim()
      .max(100, "Title cannot exceed 100 characters")
      .optional(),

    comment: z
      .string()
      .trim()
      .min(3, "Comment is required")
      .max(1000, "Comment cannot exceed 1000 characters"),
  }),
});

// GET_PRODUCT_REVIEWS ____________________________________

export const getProductReviewsValidationSchema = z.object({
  params: z.object({
    productId: z.string().trim().min(1, "Product ID is required"),
  }),

  query: z.object({
    page: z.coerce.number().int().positive().optional(),

    limit: z.coerce.number().int().positive().optional(),

    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

// UPDATE_REVIEW ____________________________________

export const updateReviewValidationSchema = z.object({
  params: z.object({
    reviewId: z.string().trim().min(1, "Review ID is required"),
  }),

  body: z.object({
    rating: z
      .number()
      .int()
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5")
      .optional(),

    title: z
      .string()
      .trim()
      .max(100, "Title cannot exceed 100 characters")
      .optional(),

    comment: z
      .string()
      .trim()
      .min(3, "Comment must be at least 3 characters")
      .max(1000, "Comment cannot exceed 1000 characters")
      .optional(),
  }),
});

// DELETE_REVIEW ____________________________________

export const deleteReviewValidationSchema = z.object({
  params: z.object({
    reviewId: z.string().trim().min(1, "Review ID is required"),
  }),
});