
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
