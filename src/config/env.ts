import { z } from "zod";

const envSchema = z.object({
  PORT: z.string(),

  NODE_ENV: z.enum([
    "development",
    "production",
    "test",
  ]),

  API_PREFIX: z.string(),

  MONGO_URI: z.string(),

  JWT_SECRET: z.string().min(10),

  JWT_EXPIRES_IN: z.string(),
});

export const envConfig = envSchema.parse(process.env);