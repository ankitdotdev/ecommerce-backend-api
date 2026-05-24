// auth.middleware.ts

import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

import { config } from "../config";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new Error("Unauthorized access");
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
