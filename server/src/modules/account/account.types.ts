import type { Types } from "mongoose";

export const ACCOUNT_TYPES = [
  "SAVINGS",
  "CURRENT",
] as const;

export const ACCOUNT_STATUSES = [
  "ACTIVE",
  "FROZEN",
  "CLOSED",
] as const;

export const ACCOUNT_CURRENCIES = [
  "INR",
] as const;

export type AccountType =
  (typeof ACCOUNT_TYPES)[number];

export type AccountStatus =
  (typeof ACCOUNT_STATUSES)[number];

export type AccountCurrency =
  (typeof ACCOUNT_CURRENCIES)[number];

export interface IAccount {
  userId: Types.ObjectId;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  currency: AccountCurrency;
  status: AccountStatus;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountInput {
  accountType: AccountType;
}

export interface AccountResponse {
  id: string;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  currency: AccountCurrency;
  status: AccountStatus;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}