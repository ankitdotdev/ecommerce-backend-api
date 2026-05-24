// jwt.ts

import jwt, { Secret, SignOptions } from "jsonwebtoken";

import { config } from "../config";

export const generateToken = (payload: {
  userId: string;
  email: string;
  role: string;
}) => {
  const secret: Secret = config.jwtSecret;

  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};
