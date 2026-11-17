import bcrypt from "bcrypt";

import { User } from "../users/user.model.js";
import { UserStatus } from "../users/user.types.js";

import { ApiError } from "../../utils/ApiError.js";

import type {
  RegisterInput,
  LoginInput
} from "./auth.validation.js";

import { Session } from "./session.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken
} from "../../utils/jwt.js";

import { REFRESH_TOKEN_TTL } from "../../utils/cookie.js";

export const registerUser = async (
  input: RegisterInput
) => {
  const existingUser = await User.findOne({
    email: input.email
  });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(
    input.password,
    12
  );

  const user = await User.create({
    fullName: input.fullName,
    email: input.email,
    password: hashedPassword
  });

  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: user.role
  };
};

export const loginUser = async (
  input: LoginInput
) => {
  const user = await User.findOne({
    email: input.email
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new ApiError(403, "Account is suspended");
  }

  const userId = user._id.toString();

  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  await Session.create({
    userId: user._id,
    refreshTokenHash: hashToken(refreshToken),
    expiresAt: new Date(
      Date.now() + REFRESH_TOKEN_TTL
    )
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: userId,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  };
};

export const refreshSession = async (
  refreshToken: string
) => {
  const decoded = (() => {
    try {
      return verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(
        401,
        "Invalid or expired refresh token"
      );
    }
  })();

  if (
    typeof decoded === "string" ||
    typeof decoded.sub !== "string"
  ) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded.sub);

  if (!user || user.status !== UserStatus.ACTIVE) {
    throw new ApiError(401, "Invalid user session");
  }

  const newRefreshToken = generateRefreshToken(
    user._id.toString()
  );

  const session = await Session.findOneAndUpdate(
    {
      userId: user._id,
      refreshTokenHash: hashToken(refreshToken),
      expiresAt: { $gt: new Date() }
    },
    {
      $set: {
        refreshTokenHash: hashToken(newRefreshToken),
        expiresAt: new Date(
          Date.now() + REFRESH_TOKEN_TTL
        )
      }
    },
    {
      new: true
    }
  );

  if (!session) {
    throw new ApiError(
      401,
      "Invalid or revoked session"
    );
  }

  return {
    accessToken: generateAccessToken(
      user._id.toString()
    ),
    refreshToken: newRefreshToken
  };
};

export const logoutUser = async (
  refreshToken: string
): Promise<void> => {
  await Session.deleteOne({
    refreshTokenHash: hashToken(refreshToken)
  });
};