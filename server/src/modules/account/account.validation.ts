import { z } from "zod";

import {
  ACCOUNT_TYPES,
} from "./account.types.js";

export const createAccountSchema = z
  .object({
    accountType: z.enum(ACCOUNT_TYPES),
  })
  .strict();

export const accountIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    "Invalid account ID"
  );

export const accountNumberSchema = z
  .string()
  .regex(
    /^91\d{11}$/,
    "Invalid account number"
  );

export type CreateAccountPayload = z.infer<
  typeof createAccountSchema
>;