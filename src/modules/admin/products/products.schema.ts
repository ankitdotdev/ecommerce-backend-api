import z from "zod";

// CREATE_PRODUCT ____________________________________

export const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2),

    description: z.string().min(10),

    price: z.number().min(0),

    stock: z.number().min(0),

    images: z.array(z.string()).min(1),

    category: z.string().min(2),

    tags: z.array(z.string()).optional(),
  }),
});

// GET_ALL_PRODUCTS ___________________________________

export const getAllProductsValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).optional(),

    limit: z.coerce.number().min(1).max(100).optional(),

    search: z.string().optional(),

    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).optional(),

    sort: z.enum(["price_asc", "price_desc", "newest", "oldest"]).optional(),
  }),
});

// UPDATE_PRODUCTS ___________________________________

export const updateProductValidationSchema = z.object({
  params: z.object({
    productId: z.string().min(1, "Product ID is required"),
  }),

  body: z.object({
    name: z
      .string()
      .min(2, "Product name must be at least 2 characters")
      .optional(),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .optional(),

    price: z.number().min(0, "Price cannot be negative").optional(),

    stock: z.number().min(0, "Stock cannot be negative").optional(),

    images: z
      .array(z.string())
      .min(1, "At least one product image is required")
      .optional(),

    category: z
      .string()
      .min(2, "Category must be at least 2 characters")
      .optional(),

    tags: z.array(z.string()).optional(),

    status: z
      .string()
      .transform((value) => value.toUpperCase())
      .pipe(
        z.enum(["DRAFT", "ACTIVE", "INACTIVE"], {
          message: "Please select a valid product status",
        }),
      )
      .optional(),
  }),
});
