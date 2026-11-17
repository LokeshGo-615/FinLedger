import mongoose from "mongoose";

import { User } from "../modules/users/user.model.js";
import { UserStatus } from "../modules/users/user.types.js";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = asyncHandler(
  async (req, _res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new ApiError(401, "Access token required");
    }

    const token = authorization.slice(7);

    const decoded = (() => {
      try {
        return verifyAccessToken(token);
      } catch {
        throw new ApiError(
          401,
          "Invalid or expired access token"
        );
      }
    })();

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      !mongoose.isValidObjectId(decoded.sub)
    ) {
      throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ApiError(403, "Account is suspended");
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  }
);