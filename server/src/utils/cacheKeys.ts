
const PREFIX = "finledger:v1";

export const CacheKeys = {
  accountMetadata: (
    userId: string,
    accountId: string
  ) =>
    `${PREFIX}:user:${userId}:account:${accountId}:metadata`,

  dashboard: (userId: string) =>
    `${PREFIX}:user:${userId}:dashboard`,

  rateLimit: (scope: string) =>
    `${PREFIX}:rate-limit:${scope}:`,
};

export const CacheTTL = {
  ACCOUNT_METADATA: 60,
  DASHBOARD: 30,
} as const;


export function dashboardCacheKeys(
  ...userIds: string[]
): string[] {
  return [...new Set(userIds)].map(
    (userId) => CacheKeys.dashboard(userId)
  );
}