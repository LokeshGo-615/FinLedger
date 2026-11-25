import type {
  RequestHandler
} from "express";

import type {
  ZodType
} from "zod";

import { ApiError } from "../utils/ApiError.js";

export const validateBody = (
  schema: ZodType
): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new ApiError(400, "Invalid request body")
      );
    }

    req.body = result.data;
    next();
  };
};