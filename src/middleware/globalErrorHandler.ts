import {
  ErrorRequestHandler,
} from "express";

import { ZodError } from "zod";

import AppError from "../utils/AppError";

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {

  let statusCode = 500;

  let message = "Something went wrong";

  let errors: unknown = [];

  // AppError
  if (err instanceof AppError) {

    statusCode = err.statusCode;

    message = err.message;
  }

  // Zod Error
  else if (err instanceof ZodError) {

    statusCode = 400;

    message = "Validation failed";

    errors = err.issues.map((issue) => ({
      field: issue.path.join("."),

      message: issue.message,
    }));
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