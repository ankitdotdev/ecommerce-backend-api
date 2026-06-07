import z from "zod";

// GET_REVIEWS ____________________________________

export const getReviewsValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),

    limit: z.coerce.number().int().positive().optional(),

    search: z.string().trim().optional(),

    rating: z.coerce
      .number()
      .int()
      .min(1)
      .max(5)
      .optional(),

    sortBy: z
      .enum([
        "rating",
        "createdAt",
        "updatedAt",
      ])
      .optional(),

    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

// GET_REVIEW_BY_ID ____________________________________

export const getReviewByIdValidationSchema = z.object({
  params: z.object({
    reviewId: z.string().trim().min(1, "Review ID is required"),
  }),
});

// DELETE_REVIEW ____________________________________

export const deleteReviewValidationSchema = z.object({
  params: z.object({
    reviewId: z.string().trim().min(1, "Review ID is required"),
  }),

  body: z.object({
    reason: z
      .string()
      .trim()
      .min(3, "Reason is required")
      .max(500, "Reason cannot exceed 500 characters"),
  }),
});