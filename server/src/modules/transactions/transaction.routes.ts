
import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import {
  depositController,
} from "./transaction.controller.js";

const router = Router();

router.use(authenticate);

router.post(
  "/deposit",
  depositController
);

export default router;
