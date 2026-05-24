// jwt.ts

import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

import { config } from "../config";

export const generateAccessToken = (payload: {
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

// REFRESH TOKEN
export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(
    payload,

    config.jwtRefreshSecret as Secret,

    {
      expiresIn: config.jwtRefreshExpiresIn as SignOptions["expiresIn"],
    },
  );
};
