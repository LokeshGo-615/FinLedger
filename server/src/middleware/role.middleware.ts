import type {
  Request,
  Response,
  NextFunction
} from "express";

import type {
  UserRole
} from "../modules/users/user.types.js";

import { ApiError } from "../utils/ApiError.js";

export const authorize = (...roles: UserRole[]) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      return next(
        new ApiError(401, "Authentication required")
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "Insufficient permissions")
      );
    }

    next();
  };
};