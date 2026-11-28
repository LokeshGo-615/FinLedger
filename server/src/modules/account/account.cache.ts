
import { Account } from "./account.model.js";

import {
  getOrSetCache,
  deleteCache,
} from "../../utils/cache.js";

import {
  CacheKeys,
  CacheTTL,
} from "../../utils/cacheKeys.js";

interface AccountMetadata {
  accountNumber: string;
  accountType: string;
  currency: string;
}

export async function getAccountMetadata(
  userId: string,
  accountId: string
): Promise<AccountMetadata | null> {
  // Always verify ownership using MongoDB.

  const ownedAccount = await Account.exists({
    _id: accountId,
    userId,
  });

  if (!ownedAccount) {
    return null;
  }

  const key = CacheKeys.accountMetadata(
    userId,
    accountId
  );

  return getOrSetCache<AccountMetadata | null>(
    key,
    async () => {
      const account = await Account.findOne({
        _id: accountId,
        userId,
      })
        .select("accountNumber accountType currency")
        .lean();

      if (!account) {
        return null;
      }

      return {
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        currency: account.currency,
      };
    },
    CacheTTL.ACCOUNT_METADATA
  );
}

export async function invalidateAccountCache(
  userId: string,
  accountId: string
): Promise<boolean> {
  return deleteCache(
    CacheKeys.accountMetadata(userId, accountId),
    CacheKeys.dashboard(userId)
  );
}
