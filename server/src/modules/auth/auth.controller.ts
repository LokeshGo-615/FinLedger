import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../users/user.model.js";
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser
} from "./auth.service.js";

import {
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_TTL,
  refreshCookieOptions
} from "../../utils/cookie.js";

import {
  registerSchema,
  loginSchema
} from "./auth.validation.js";



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

    res.cookie(
      REFRESH_TOKEN_COOKIE,
      data.refreshToken,
      {
        ...refreshCookieOptions,
        maxAge: REFRESH_TOKEN_TTL
      }
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: data.accessToken,
          user: data.user
        },
        "Login successful"
      )
    );
  }
);

export const refresh = asyncHandler(
  async (req, res) => {
    const refreshToken =
      req.cookies?.[REFRESH_TOKEN_COOKIE];

    if (typeof refreshToken !== "string") {
      throw new ApiError(
        401,
        "Refresh token required"
      );
    }

    const data = await refreshSession(refreshToken);

    res.cookie(
      REFRESH_TOKEN_COOKIE,
      data.refreshToken,
      {
        ...refreshCookieOptions,
        maxAge: REFRESH_TOKEN_TTL
      }
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: data.accessToken
        },
        "Session refreshed successfully"
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

export const logout = asyncHandler(
  async (req, res) => {
    const refreshToken =
      req.cookies?.[REFRESH_TOKEN_COOKIE];

    if (typeof refreshToken === "string") {
      await logoutUser(refreshToken);
    }

    res.clearCookie(
      REFRESH_TOKEN_COOKIE,
      refreshCookieOptions
    );

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Logout successful"
      )
    );
  }
);