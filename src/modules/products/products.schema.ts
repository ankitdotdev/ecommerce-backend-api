import z from "zod";

// GET_ALL_PRODUCTS ____________________________________

export const getAllProductsValidationSchema = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .min(1, "Page number must be at least 1")
      .optional(),

    limit: z.coerce
      .number()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .optional(),

    search: z.string().optional(),

    category: z.string().optional(),

    sort: z
      .enum(["price_asc", "price_desc", "newest", "oldest"], {
        message:
          "Sort must be one of: newest, oldest, price_asc, or price_desc",
      })
      .optional(),
  }),
});

// PRODUCT_SLUG ____________________________________

export const productSlugValidationSchema = z.object({
  params: z.object({
    slug: z
      .string()
      .trim()
      .min(1, "Product slug is required"),
  }),
});