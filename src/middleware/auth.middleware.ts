import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { config } from "../config";
import { UserRole } from "../modules/users/user.interface";
import { IAuthUser } from "../types/auth.types";

class AuthMiddleware {
  auth = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new Error("Access token is required");
      }

      const decoded = jwt.verify(token, config.jwtSecret) as IAuthUser;

      req.user = decoded;

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(new Error("Session expired. Please login again."));
      }

      if (error instanceof JsonWebTokenError) {
        return next(new Error("Invalid access token."));
      }

      next(error);
    }
  };

  admin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.ADMIN) {
      throw new Error("You do not have permission to access this resource.");
    }

    next();
  };

  customer = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.CUSTOMER) {
      throw new Error("You do not have permission to access this resource.");
    }

    next();
  };
}

export const authMiddleware = new AuthMiddleware();
