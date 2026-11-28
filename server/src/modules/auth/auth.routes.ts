import { Router } from "express";

import {
  register,
  login,
  refresh,
  logout,
  getCurrentUser
} from "./auth.controller.js";

import {
  authenticate
} from "../../middleware/auth.middleware.js";

import {
  authorize
} from "../../middleware/role.middleware.js";

import {
  authLimiter,
  refreshLimiter
} from "../../middleware/rateLimit.middleware.js";

import {
  UserRole
} from "../users/user.types.js";

import {
  authRateLimiter,
} from "../../middleware/distributedRateLimit.js";

const router = Router();

router.post("/register", authLimiter, register);

router.post("/login", authLimiter, login);

router.post("/refresh", refreshLimiter, refresh);

router.post("/logout", logout);

router.get("/me", authenticate, getCurrentUser);

router.get(
  "/admin",
  authenticate,
  authorize(UserRole.ADMIN),
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the admin panel"
    });
  }
);

export default router;