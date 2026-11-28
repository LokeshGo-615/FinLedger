import { Router } from "express";

import {
  createBankAccount,
  getMyAccounts,
  getBankAccount,
  freezeBankAccount,
  unfreezeBankAccount,
  closeBankAccount,
  getAccountMetadataController,
} from "./account.controller.js";

import {
  authenticate,
  authorize,
} from "../../middleware/auth.middleware.js";
import { validateBody } from "../../middleware/validate.middleware.js";
import { createAccountSchema } from "./account.validation.js";

const router = Router();
router.use(authenticate);

router.post(
  "/",
  validateBody(createAccountSchema),
  createBankAccount
);



// Create account
router.post("/", createBankAccount);

// Get all accounts
router.get("/", getMyAccounts);

// Get specific account
router.get("/:accountId", getBankAccount);

// Account owner can close their own account
router.patch(
  "/:accountId/close",
  closeBankAccount
);

// ADMIN-only account lifecycle operations
router.patch(
  "/:accountId/freeze",
  authorize("ADMIN"),
  freezeBankAccount
);

router.patch(
  "/:accountId/unfreeze",
  authorize("ADMIN"),
  unfreezeBankAccount
);

router.get(
  "/:accountId/metadata",
  getAccountMetadataController
);

export default router;