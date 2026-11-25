
import { Types } from "mongoose";

// Reserved internal ledger identifier.
// It is NOT a customer bank account.
export const SYSTEM_FUNDING_ACCOUNT_ID =
  new Types.ObjectId("000000000000000000000001");
