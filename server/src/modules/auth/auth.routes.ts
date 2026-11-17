import { Router } from "express";

import {
  register,
  login,
  getCurrentUser
} from "./auth.controller.js";

import {
  authenticate
} from "../../middleware/auth.middleware.js";

import {
  authorize
} from "../../middleware/role.middleware.js";

import {
  UserRole
} from "../users/user.types.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

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