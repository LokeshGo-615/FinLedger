
import { z } from "zod";

import { accountIdSchema } from "../account/account.validation.js";

export const depositSchema = z.object({
  accountId: accountIdSchema,

  amount: z.string().regex(
    /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    "Amount must be a valid rupee amount"
  ),
}).strict();

export type DepositInput = z.infer<typeof depositSchema>;

export const withdrawalSchema = z.object({
  accountId: accountIdSchema,

  amount: z.string().regex(
    /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    "Amount must be a valid rupee amount"
  ),
}).strict();

export type WithdrawalInput =
  z.infer<typeof withdrawalSchema>;


  export const transferSchema = z.object({
  sourceAccountId: accountIdSchema,

  destinationAccountId: accountIdSchema,

  amount: z.string().regex(
    /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    "Amount must be a valid rupee amount"
  ),
})
.strict()
.refine(
  (data) =>
    data.sourceAccountId.toLowerCase() !==
    data.destinationAccountId.toLowerCase(),
  {
    message: "Cannot transfer to the same account",
    path: ["destinationAccountId"],
  }
);

export type TransferInput = z.infer<typeof transferSchema>;


export const transactionHistorySchema = z
  .object({
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    cursor: z.string().min(1).max(512).optional(),

    type: z.enum([
      "DEPOSIT",
      "WITHDRAWAL",
      "TRANSFER",
    ]).optional(),

    accountId: accountIdSchema.optional(),

    direction: z.enum([
      "INCOMING",
      "OUTGOING",
    ]).optional(),

    sort: z.enum([
      "asc",
      "desc",
    ]).default("desc"),

    fromDate: z.string().datetime().optional(),

    toDate: z.string().datetime().optional(),
  })
  .strict()
  .refine(
    (data) =>
      !data.fromDate ||
      !data.toDate ||
      new Date(data.fromDate) <= new Date(data.toDate),
    {
      message: "fromDate must be before or equal to toDate",
      path: ["fromDate"],
    }
  );

export type TransactionHistoryInput =
  z.infer<typeof transactionHistorySchema>;

export const transactionIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid transaction ID");

