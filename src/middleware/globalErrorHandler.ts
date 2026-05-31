import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import AppError from "../utils/errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors: unknown = [];

  // App Error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";

    errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Mongoose Validation Error
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";

    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  }

  // Invalid MongoDB ObjectId
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid resource identifier";
  }

  // Duplicate Key Error
  else if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  ) {
    statusCode = 409;

    const field = Object.keys(err.keyPattern || {})[0];

    message = `${field} already exists`;
  }

  // Generic Error
  else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default globalErrorHandler;
