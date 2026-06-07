import { z } from "zod";

const envSchema = z.object({
  PORT: z.string(),

  NODE_ENV: z.enum(["development", "production", "test"]),

  API_PREFIX: z.string(),

  // EMAIL CONFIG
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),

  MONGO_URI: z.string(),

  JWT_ACCESS_SECRET: z.string().min(10),

  JWT_ACCESS_EXPIRES_IN: z.string(),

  JWT_REFRESH_SECRET: z.string().min(10),

  JWT_REFRESH_EXPIRES_IN: z.string(),

  // CLOUDINARY CONFIG
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  // RAZORPAY CONFIG
  RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string(),

  // COMPANY NAME
  COMPANY_NAME: z.string(),

  // COMPANY ADMIL EMAIL
  ADMIN_EMAIL: z.string(),
});

export const envConfig = envSchema.parse(process.env);
