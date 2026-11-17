import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../users/user.model.js";

import {
  registerSchema,
  loginSchema
} from "./auth.validation.js";

import {
  registerUser,
  loginUser
} from "./auth.service.js";

export const register = asyncHandler(
  async (req, res) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(
        400,
        "Validation failed",
        result.error.issues
      );
    }

    const user = await registerUser(result.data);

    res.status(201).json(
      new ApiResponse(
        201,
        user,
        "Registration successful"
      )
    );
  }
);

export const login = asyncHandler(
  async (req, res) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(
        400,
        "Validation failed",
        result.error.issues
      );
    }

    const data = await loginUser(result.data);

    res.status(200).json(
      new ApiResponse(
        200,
        data,
        "Login successful"
      )
    );
  }
);

export const getCurrentUser = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user?.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        user,
        "User fetched successfully"
      )
    );
  }
);