import { randomInt } from "node:crypto";

const ACCOUNT_NUMBER_PREFIX = "91";

export function generateAccountNumber(): string {
  const randomPart = randomInt(
    0,
    100_000_000_000
  )
    .toString()
    .padStart(11, "0");

  return `${ACCOUNT_NUMBER_PREFIX}${randomPart}`;
}