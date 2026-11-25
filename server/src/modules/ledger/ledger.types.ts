
import type { Types } from "mongoose";

export const LEDGER_DIRECTIONS = [
  "DEBIT",
  "CREDIT",
] as const;

export const LEDGER_ACCOUNT_KINDS = [
  "CUSTOMER",
  "SYSTEM",
] as const;

export type LedgerDirection =
  (typeof LEDGER_DIRECTIONS)[number];

export type LedgerAccountKind =
  (typeof LEDGER_ACCOUNT_KINDS)[number];

export interface ILedgerEntry {
  transactionId: Types.ObjectId;

  accountKind: LedgerAccountKind;

  accountId: Types.ObjectId;

  direction: LedgerDirection;

  amount: number;
  currency: "INR";

  createdAt: Date;
}
