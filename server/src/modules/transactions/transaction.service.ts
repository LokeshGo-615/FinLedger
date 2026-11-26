
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
import {
  encodeCursor,
  decodeCursor,
} from "../../utils/cursor.js";
import type {
  DepositInput,
  WithdrawalInput,
  TransactionHistoryInput,
  TransferInput,
} from "./transaction.validation.js";

function buildRequestHash(
  userId: string,
  accountId: string,
  amount: number,
  type: "DEPOSIT" | "WITHDRAWAL" = "DEPOSIT"
): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        userId,
        accountId,
        amount,
        type,
      })
    )
    .digest("hex");
}

function buildTransferRequestHash(
  userId: string,
  sourceAccountId: string,
  destinationAccountId: string,
  amount: number
): string {

  return createHash("sha256")
    .update(
      JSON.stringify({
        userId,
        sourceAccountId,
        destinationAccountId,
        amount,
        type: "TRANSFER",
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



export async function withdrawMoney(
  userId: string,
  input: WithdrawalInput,
  idempotencyKey: string
) {
  const amount = rupeesToPaise(input.amount);

  if (amount <= 0 || amount > MAX_BALANCE) {
    throw new ApiError(400, "Invalid withdrawal amount");
  }

  const ownerId = new Types.ObjectId(userId);
  const accountId = new Types.ObjectId(input.accountId);

  const requestHash = buildRequestHash(
    userId,
    accountId.toString(),
    amount,
    "WITHDRAWAL"
  );

  // Check previously completed request.
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

        // Recheck idempotency inside transaction.
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

        // Check ownership and atomically deduct funds.
        const account = await Account.findOneAndUpdate(
          {
            _id: accountId,
            userId: ownerId,
            status: "ACTIVE",
            balance: {
              $gte: amount,
              $lte: MAX_BALANCE,
            },
          },
          {
            $inc: {
              balance: -amount,
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
            "Account unavailable or insufficient balance"
          );
        }

        // Create withdrawal transaction.
        const [transaction] = await Transaction.create(
          [
            {
              userId: ownerId,
              type: "WITHDRAWAL",
              sourceAccountId: accountId,
              destinationAccountId: null,
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
          throw new Error(
            "Withdrawal transaction creation failed"
          );
        }

        // Create double-entry ledger records.
        await LedgerEntry.create(
          [
            {
              transactionId: transaction._id,
              accountKind: "CUSTOMER",
              accountId,
              direction: "DEBIT",
              amount,
              currency: "INR",
            },
            {
              transactionId: transaction._id,
              accountKind: "SYSTEM",
              accountId: SYSTEM_FUNDING_ACCOUNT_ID,
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

    // Handle concurrent idempotent requests.
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

    if (process.env.NODE_ENV === "test") {
      console.error("WITHDRAWAL SERVICE ERROR:", error);
    }

    throw error;
  }
}


export async function transferMoney(
  userId: string,
  input: TransferInput,
  idempotencyKey: string
) {

  // 1. Convert rupees into paise
  const amount = rupeesToPaise(input.amount);

  if (amount <= 0 || amount > MAX_BALANCE) {
    throw new ApiError(400, "Invalid transfer amount");
  }

  // 2. Convert IDs into MongoDB ObjectIds
  const ownerId = new Types.ObjectId(userId);

  const sourceAccountId = new Types.ObjectId(
    input.sourceAccountId
  );

  const destinationAccountId = new Types.ObjectId(
    input.destinationAccountId
  );

  // 3. Prevent self-transfer
  if (sourceAccountId.equals(destinationAccountId)) {
    throw new ApiError(
      400,
      "Cannot transfer to the same account"
    );
  }

  // 4. Generate request hash
  const requestHash = buildTransferRequestHash(
    ownerId.toString(),
    sourceAccountId.toString(),
    destinationAccountId.toString(),
    amount
  );

  // 5. Check existing transaction
  const existingTransaction = await Transaction.findOne({
    userId: ownerId,
    idempotencyKey,
  });

  if (existingTransaction) {

    if (existingTransaction.requestHash !== requestHash) {
      throw new ApiError(
        409,
        "Idempotency key already used for another request"
      );
    }

    return existingTransaction;
  }

  try {

    // 6. Start atomic database transaction
    return await mongoose.connection.transaction(
      async (session) => {

        // Recheck idempotency inside transaction
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

        // 7. Debit sender account
        const sender = await Account.findOneAndUpdate(
          {
            _id: sourceAccountId,
            userId: ownerId,
            status: "ACTIVE",
            balance: {
              $gte: amount,
              $lte: MAX_BALANCE,
            },
          },
          {
            $inc: {
              balance: -amount,
            },
          },
          {
            session,
            returnDocument: "after",
          }
        );

        if (!sender) {
          throw new ApiError(
            409,
            "Sender account unavailable or insufficient balance"
          );
        }

        // 8. Credit receiver account
        const receiver = await Account.findOneAndUpdate(
          {
            _id: destinationAccountId,
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

        if (!receiver) {
          throw new ApiError(
            409,
            "Receiver account unavailable or balance limit exceeded"
          );
        }

        // 9. Create transaction record
        const [transaction] = await Transaction.create(
          [
            {
              userId: ownerId,
              type: "TRANSFER",
              sourceAccountId,
              destinationAccountId,
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

        // 10. Create double-entry ledger
        await LedgerEntry.create(
          [
            {
              transactionId: transaction._id,
              accountKind: "CUSTOMER",
              accountId: sourceAccountId,
              direction: "DEBIT",
              amount,
              currency: "INR",
            },
            {
              transactionId: transaction._id,
              accountKind: "CUSTOMER",
              accountId: destinationAccountId,
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

    // Recover an already committed matching request
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


export async function getTransactionHistory(
  userId: string,
  input: TransactionHistoryInput
) {
  const ownerId = new Types.ObjectId(userId);

  const accounts = await Account.find({
    userId: ownerId,
  }).select("_id");

  let accountIds = accounts.map(
    (account) => account._id
  );

  if (input.accountId) {
    const selectedAccount = accountIds.find(
      (id) => id.equals(input.accountId)
    );

    if (!selectedAccount) {
      throw new ApiError(404, "Account not found");
    }

    accountIds = [selectedAccount];
  }

  const conditions: Record<string, unknown>[] = [];

  // Ownership and direction filter
  if (input.direction === "INCOMING") {
    conditions.push({
      destinationAccountId: { $in: accountIds },
    });
  } else if (input.direction === "OUTGOING") {
    conditions.push({
      sourceAccountId: { $in: accountIds },
    });
  } else {
    conditions.push({
      $or: [
        {
          sourceAccountId: { $in: accountIds },
        },
        {
          destinationAccountId: { $in: accountIds },
        },
      ],
    });
  }

  // Transaction type filter
  if (input.type) {
    conditions.push({
      type: input.type,
    });
  }

  // Date range filter
  if (input.fromDate || input.toDate) {
    const dateFilter: Record<string, Date> = {};

    if (input.fromDate) {
      dateFilter.$gte = new Date(input.fromDate);
    }

    if (input.toDate) {
      dateFilter.$lte = new Date(input.toDate);
    }

    conditions.push({
      createdAt: dateFilter,
    });
  }

  const sortOrder = input.sort === "asc" ? 1 : -1;

  // Cursor-based pagination
  if (input.cursor) {
    const cursor = decodeCursor(input.cursor);

    const operator =
      sortOrder === 1 ? "$gt" : "$lt";

    conditions.push({
      $or: [
        {
          createdAt: {
            [operator]: cursor.createdAt,
          },
        },
        {
          createdAt: cursor.createdAt,
          _id: {
            [operator]: cursor.id,
          },
        },
      ],
    });
  }

  const transactions = await Transaction.find({
    $and: conditions,
  })
    .sort({
      createdAt: sortOrder,
      _id: sortOrder,
    })
    .limit(input.limit + 1)
    .select(
      "_id type sourceAccountId destinationAccountId " +
      "amount currency status createdAt"
    )
    .lean();

  const hasMore = transactions.length > input.limit;

  const results = transactions.slice(0, input.limit);

  const lastTransaction = results[results.length - 1];

  const nextCursor =
    hasMore && lastTransaction
      ? encodeCursor(
          lastTransaction.createdAt,
          lastTransaction._id.toString()
        )
      : null;

  return {
    transactions: results,
    pagination: {
      limit: input.limit,
      hasMore,
      nextCursor,
    },
  };
}



export async function getTransactionById(
  userId: string,
  transactionId: string
) {
  const accounts = await Account.find({
    userId: new Types.ObjectId(userId),
  }).select("_id");

  const accountIds = accounts.map(
    (account) => account._id
  );

  const transaction = await Transaction.findOne({
    _id: new Types.ObjectId(transactionId),

    $or: [
      {
        sourceAccountId: { $in: accountIds },
      },
      {
        destinationAccountId: { $in: accountIds },
      },
    ],
  })
    .select(
      "_id type sourceAccountId destinationAccountId " +
      "amount currency status createdAt"
    )
    .lean();

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return transaction;
}
