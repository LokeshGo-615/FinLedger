
import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import {
  depositController,
  withdrawalController,
} from "./transaction.controller.js";

const router = Router();

router.use(authenticate);

router.post("/deposit", depositController);

router.post("/withdraw", withdrawalController);

export default router;
