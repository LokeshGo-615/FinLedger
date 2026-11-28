
import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import {
  transactionRateLimiter,
} from "../../middleware/distributedRateLimit.js";

import {
  depositController,
  withdrawalController,
  transferController,
  getTransactionHistoryController,
  getTransactionByIdController,
} from "./transaction.controller.js";

const router = Router();

router.use(authenticate);

router.post(
  "/deposit",
  transactionRateLimiter,
  depositController
);

router.post(
  "/withdraw",
  transactionRateLimiter,
  withdrawalController
);

router.post(
  "/transfer",
  transactionRateLimiter,
  transferController
);

router.get(
  "/",
  getTransactionHistoryController
);

router.get(
  "/:transactionId",
  getTransactionByIdController
);

export default router;
