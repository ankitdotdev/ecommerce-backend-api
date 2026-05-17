import dotenv from "dotenv";

dotenv.config();

import { envConfig } from "./env";

export const config = {
  port: envConfig.PORT,

  nodeEnv: envConfig.NODE_ENV,

  mongoUri: envConfig.MONGO_URI,

  jwtSecret: envConfig.JWT_SECRET,

  jwtExpiresIn: envConfig.JWT_EXPIRES_IN,
};