import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { config } from "../config";
import { UserRole } from "../modules/users/user.interface";
import { IAuthUser } from "../types/auth.types";
import {
  UnauthorizedError,
  ForbiddenError,
} from "../utils/AppError";

class AuthMiddleware {
  auth = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new UnauthorizedError(
          "Please sign in to continue."
        );
      }

      const decoded = jwt.verify(
        token,
        config.jwtSecret
      ) as IAuthUser;

      req.user = decoded;

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(
          new UnauthorizedError(
            "Your session has expired. Please sign in again."
          )
        );
      }

      if (error instanceof JsonWebTokenError) {
        return next(
          new UnauthorizedError(
            "Authentication failed. Please sign in again."
          )
        );
      }

      next(error);
    }
  };

  admin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.ADMIN) {
      throw new ForbiddenError(
        "You do not have permission to access this resource."
      );
    }

    next();
  };

  customer = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.CUSTOMER) {
      throw new ForbiddenError(
        "You do not have permission to access this resource."
      );
    }

    next();
  };
}

export const authMiddleware = new AuthMiddleware();