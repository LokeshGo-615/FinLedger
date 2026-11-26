
import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import {
  depositController,
  withdrawalController,
  transferController,
  getTransactionHistoryController,
  getTransactionByIdController,
} from "./transaction.controller.js";

const router = Router();

router.use(authenticate);

// Transaction operations
router.post("/deposit", depositController);
router.post("/withdraw", withdrawalController);
router.post("/transfer", transferController);

// Transaction history
router.get("/", getTransactionHistoryController);

router.get(
  "/:transactionId",
  getTransactionByIdController
);

export default router;
