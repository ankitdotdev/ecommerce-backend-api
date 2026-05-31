import { NextFunction, Request, Response } from "express";
import multer from "multer";

export const multerErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File size exceeds the maximum allowed limit of 5MB.",
          errors: [],
        });

      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Unexpected file field received.",
          errors: [],
        });

      default:
        return res.status(400).json({
          success: false,
          message: error.message,
          errors: [],
        });
    }
  }

  next(error);
};
