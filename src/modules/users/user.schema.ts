import z from "zod";

// UPDATE_USER_PROFILE

export const updateMeValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),

    phone: z.string().trim().min(10).max(20).optional(),

    dateOfBirth: z.coerce.date().optional(),

    gender: z.enum(["male", "female", "other"]).optional(),
  }),
});
