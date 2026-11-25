import {
  Types,
  type HydratedDocument,
} from "mongoose";
import mongoose from "mongoose";
import { reserveAccountSlot } from "./account-slot.service.js";
import { Account } from "./account.model.js";
import { User } from "../users/user.model.js";

import type {
  IAccount,
  CreateAccountInput,
  AccountResponse,
} from "./account.types.js";

import {
  MAX_ACCOUNT_NUMBER_RETRIES,
  DEFAULT_ACCOUNT_CURRENCY,
  DEFAULT_ACCOUNT_STATUS,
} from "./account.constants.js";

import { ApiError } from "../../utils/ApiError.js";

import {
  generateAccountNumber,
} from "../../utils/accountNumber.js";


// Convert database document into API response
function toAccountResponse(
  account: HydratedDocument<IAccount>
): AccountResponse {
  return {
    id: account._id.toString(),
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    balance: account.balance,
    currency: account.currency,
    status: account.status,
    closedAt: account.closedAt,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}


// Check whether account number already exists
function isAccountNumberCollision(
  error: unknown
): boolean {
  if (
    typeof error !== "object" ||
    error === null
  ) {
    return false;
  }

  const mongoError = error as {
    code?: number;
    keyPattern?: Record<string, number>;
  };

  return (
    mongoError.code === 11000 &&
    mongoError.keyPattern?.accountNumber === 1
  );
}


// Create a new account

export async function createAccount(
  userId: string,
  input: CreateAccountInput
): Promise<AccountResponse> {
  const ownerId = new Types.ObjectId(userId);

  // Ensure the unique account number index exists.
  await Account.init();

  for (
    let attempt = 0;
    attempt < MAX_ACCOUNT_NUMBER_RETRIES;
    attempt++
  ) {
    try {
      return await mongoose.connection.transaction(
        async (session) => {
          // Reserve one of the user's five account slots.
          await reserveAccountSlot(userId, session);

          const accountNumber = generateAccountNumber();

          const accounts = await Account.create(
            [
              {
                userId: ownerId,
                accountNumber,
                accountType: input.accountType,
                balance: 0,
                currency: DEFAULT_ACCOUNT_CURRENCY,
                status: DEFAULT_ACCOUNT_STATUS,
                closedAt: null,
              },
            ],
            { session }
          );

          return toAccountResponse(accounts[0]);
        }
      );
    } catch (error) {
      if (isAccountNumberCollision(error)) {
        if (attempt < MAX_ACCOUNT_NUMBER_RETRIES - 1) {
          continue;
        }

        throw new ApiError(
          503,
          "Unable to generate a unique account number"
        );
      }

      throw error;
    }
  }

  throw new ApiError(
    503,
    "Account creation temporarily unavailable"
  );
}



// Get all accounts owned by current user
export async function getUserAccounts(
  userId: string
): Promise<AccountResponse[]> {
  const accounts = await Account.find({
    userId: new Types.ObjectId(userId),
  }).sort({
    createdAt: -1,
  });

  return accounts.map(toAccountResponse);
}


// Get a specific account owned by current user
export async function getAccountById(
  userId: string,
  accountId: string
): Promise<AccountResponse> {
  if (!/^[a-fA-F0-9]{24}$/.test(accountId)) {
    throw new ApiError(
      400,
      "Invalid account ID"
    );
  }

  const account = await Account.findOne({
    _id: new Types.ObjectId(accountId),
    userId: new Types.ObjectId(userId),
  });

  if (!account) {
    throw new ApiError(
      404,
      "Account not found"
    );
  }

  return toAccountResponse(account);
}

export async function freezeAccount(
  accountId: string
): Promise<AccountResponse> {
  const account = await Account.findOneAndUpdate(
    {
      _id: new Types.ObjectId(accountId),
      status: "ACTIVE",
    },
    {
      $set: {
        status: "FROZEN",
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!account) {
    throw new ApiError(
      409,
      "Account not found or cannot be frozen"
    );
  }

  return toAccountResponse(account);
}

export async function unfreezeAccount(
  accountId: string
): Promise<AccountResponse> {
  const account = await Account.findOneAndUpdate(
    {
      _id: new Types.ObjectId(accountId),
      status: "FROZEN",
    },
    {
      $set: {
        status: "ACTIVE",
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!account) {
    throw new ApiError(
      409,
      "Account not found or cannot be unfrozen"
    );
  }

  return toAccountResponse(account);
}


export async function closeAccount(
  userId: string,
  accountId: string
): Promise<AccountResponse> {
  const ownerId = new Types.ObjectId(userId);
  const targetId = new Types.ObjectId(accountId);

  return mongoose.connection.transaction(async (session) => {
    const account = await Account.findOneAndUpdate(
      {
        _id: targetId,
        userId: ownerId,
        status: "ACTIVE",
        balance: 0,
      },
      {
        $set: {
          status: "CLOSED",
          closedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (!account) {
      const ownedAccount = await Account.exists({
        _id: targetId,
        userId: ownerId,
      }).session(session);

      if (!ownedAccount) {
        throw new ApiError(404, "Account not found");
      }

      throw new ApiError(
        409,
        "Account must be active with zero balance"
      );
    }

    const result = await User.updateOne(
      {
        _id: ownerId,
        activeAccountCount: { $gt: 0 },
      },
      {
        $inc: {
          activeAccountCount: -1,
        },
      },
      { session }
    );

    if (result.modifiedCount !== 1) {
      throw new ApiError(
        409,
        "Account counter is inconsistent"
      );
    }

    return toAccountResponse(account);
  });
}
