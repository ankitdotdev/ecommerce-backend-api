import dotenv from "dotenv";

dotenv.config();

import { envConfig } from "./env";

export const config = {
  port: envConfig.PORT,

  nodeEnv: envConfig.NODE_ENV,

  mongoUri: envConfig.MONGO_URI,

  jwtSecret: envConfig.JWT_ACCESS_SECRET,

  jwtExpiresIn: envConfig.JWT_ACCESS_EXPIRES_IN,

  jwtRefreshSecret: envConfig.JWT_REFRESH_SECRET,

  jwtRefreshExpiresIn: envConfig.JWT_REFRESH_EXPIRES_IN,

  apiPrefix: envConfig.API_PREFIX,

  // EMAIL SERVICE CONFIG
  resendApiKey: envConfig.RESEND_API_KEY,

  emailFrom: envConfig.EMAIL_FROM,

  // CLOUDINARY CONFIG
  cloudinaryCloudName: envConfig.CLOUDINARY_CLOUD_NAME,

  cloudinaryApiKey: envConfig.CLOUDINARY_API_KEY,

  cloudinaryApiSecret: envConfig.CLOUDINARY_API_SECRET,

  // RAZORPAY CONFIG

  RAZORPAY_KEY_ID: envConfig.CLOUDINARY_API_SECRET,
  RAZORPAY_KEY_SECRET: envConfig.CLOUDINARY_API_SECRET,
};
