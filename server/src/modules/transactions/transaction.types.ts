
import type { Types } from "mongoose";

export const TRANSACTION_TYPES = [
  "DEPOSIT",
  "WITHDRAWAL",
  "TRANSFER",
] as const;

export const TRANSACTION_STATUSES = [
  "COMPLETED",
] as const;

export type TransactionType =
  (typeof TRANSACTION_TYPES)[number];

export type TransactionStatus =
  (typeof TRANSACTION_STATUSES)[number];

export interface ITransaction {
  userId: Types.ObjectId;

  type: TransactionType;

  sourceAccountId: Types.ObjectId | null;
  destinationAccountId: Types.ObjectId | null;

  amount: number;
  currency: "INR";

  idempotencyKey: string;
  requestHash: string;

  status: TransactionStatus;

  createdAt: Date;
  updatedAt: Date;
}
