
import mongoose, { Types } from "mongoose";
import { createHash } from "node:crypto";
import { Account } from "../account/account.model.js";
import { Transaction } from "./transaction.model.js";
import { LedgerEntry } from "../ledger/ledger.model.js";
import { SYSTEM_FUNDING_ACCOUNT_ID } from "../ledger/system-ledger.js";
import {
  MAX_BALANCE,
  rupeesToPaise,
} from "../../utils/money.js";
import { ApiError } from "../../utils/ApiError.js";

import type {
  DepositInput,
} from "./transaction.validation.js";

function buildRequestHash(
  userId: string,
  accountId: string,
  amount: number
): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        userId,
        accountId,
        amount,
        type: "DEPOSIT",
      })
    )
    .digest("hex");
}

export async function depositMoney(
  userId: string,
  input: DepositInput,
  idempotencyKey: string
) {
  const amount = rupeesToPaise(input.amount);

  if (amount <= 0 || amount > MAX_BALANCE) {
    throw new ApiError(400, "Invalid deposit amount");
  }

  const ownerId = new Types.ObjectId(userId);
  const accountId = new Types.ObjectId(input.accountId);

  const requestHash = buildRequestHash(
    userId,
    accountId.toString(),
    amount
  );

  // Check for a previously completed request.
  const existing = await Transaction.findOne({
    userId: ownerId,
    idempotencyKey,
  });

  if (existing) {
    if (existing.requestHash !== requestHash) {
      throw new ApiError(
        409,
        "Idempotency key already used for another request"
      );
    }

    return existing;
  }

  try {
    return await mongoose.connection.transaction(
      async (session) => {
        // Recheck inside transaction.
        const duplicate = await Transaction.findOne({
          userId: ownerId,
          idempotencyKey,
        }).session(session);

        if (duplicate) {
          if (duplicate.requestHash !== requestHash) {
            throw new ApiError(
              409,
              "Idempotency key already used for another request"
            );
          }

          return duplicate;
        }

        // Atomic balance increment with ownership,
        // account status and maximum balance checks.
        const account = await Account.findOneAndUpdate(
          {
            _id: accountId,
            userId: ownerId,
            status: "ACTIVE",
            balance: {
              $gte: 0,
              $lte: MAX_BALANCE - amount,
            },
          },
          {
            $inc: {
              balance: amount,
            },
          },
          {
            session,
            returnDocument: "after",
          }
        );

        if (!account) {
          throw new ApiError(
            409,
            "Account unavailable or balance limit exceeded"
          );
        }

        const [transaction] = await Transaction.create(
          [
            {
              userId: ownerId,
              type: "DEPOSIT",
              sourceAccountId: null,
              destinationAccountId: accountId,
              amount,
              currency: "INR",
              idempotencyKey,
              requestHash,
              status: "COMPLETED",
            },
          ],
          { session }
        );

        if (!transaction) {
          throw new Error("Transaction creation failed");
        }

        await LedgerEntry.create(
  [
    {
      transactionId: transaction._id,
      accountKind: "SYSTEM",
      accountId: SYSTEM_FUNDING_ACCOUNT_ID,
      direction: "DEBIT",
      amount,
      currency: "INR",
    },
    {
      transactionId: transaction._id,
      accountKind: "CUSTOMER",
      accountId,
      direction: "CREDIT",
      amount,
      currency: "INR",
    },
  ],
  {
    session,
    ordered: true,
  }
);

        return transaction;
      }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "test") {
  console.error("DEPOSIT SERVICE ERROR:", error);
}
    // Handle a concurrent request that committed
    // the same idempotency key first.
    const committed = await Transaction.findOne({
      userId: ownerId,
      idempotencyKey,
    });

    if (committed) {
      if (committed.requestHash !== requestHash) {
        throw new ApiError(
          409,
          "Idempotency key already used for another request"
        );
      }

      return committed;
    }

    throw error;
  }
}
