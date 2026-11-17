import type {
  Request,
  Response,
  NextFunction
} from "express";

import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors
    });

    return;
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};