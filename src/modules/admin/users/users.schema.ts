import z from "zod";

// GET_USERS ____________________________________

export const getUsersValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),

    limit: z.coerce.number().int().positive().optional(),

    search: z.string().trim().optional(),

    status: z.enum(["active", "blocked", "inactive"]).optional(),

    sortBy: z
      .enum([
        "name",
        "email",
        "createdAt",
        "updatedAt",
        "lastLoginAt",
      ])
      .optional(),

    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

// GET_USER_BY_ID ____________________________________

export const getUserByIdValidationSchema = z.object({
  params: z.object({
    userId: z.string().trim().min(1, "User ID is required"),
  }),
});

// BLOCK_USER ____________________________________

export const blockUserValidationSchema = z.object({
  params: z.object({
    userId: z.string().trim().min(1, "User ID is required"),
  }),

  body: z.object({
    reason: z
      .string()
      .trim()
      .min(3, "Reason is required")
      .max(500),
  }),
});

// UNBLOCK_USER ____________________________________

export const unblockUserValidationSchema = z.object({
  params: z.object({
    userId: z.string().trim().min(1, "User ID is required"),
  }),
});

// GET_USER_STATS ____________________________________

export const getUserStatsValidationSchema = z.object({
  query: z.object({}),
});