
import mongoose, { Schema } from "mongoose";

import {
  TRANSACTION_TYPES,
  TRANSACTION_STATUSES,
} from "./transaction.types.js";

import type {
  ITransaction,
} from "./transaction.types.js";

import { MAX_BALANCE } from "../../utils/money.js";

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },

    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
      immutable: true,
    },

    sourceAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      default: null,
      immutable: true,
    },

    destinationAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      default: null,
      immutable: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
      max: MAX_BALANCE,
      immutable: true,
      validate: {
        validator: Number.isSafeInteger,
        message: "Amount must be an integer",
      },
    },

    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
      required: true,
      immutable: true,
    },

    idempotencyKey: {
      type: String,
      required: true,
      immutable: true,
    },

    requestHash: {
      type: String,
      required: true,
      immutable: true,
    },

    status: {
      type: String,
      enum: TRANSACTION_STATUSES,
      default: "COMPLETED",
      required: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// One idempotency key per user.
transactionSchema.index(
  { userId: 1, idempotencyKey: 1 },
  { unique: true }
);

transactionSchema.index({
  sourceAccountId: 1,
  createdAt: -1,
});

transactionSchema.index({
  destinationAccountId: 1,
  createdAt: -1,
});

export const Transaction =
  mongoose.model<ITransaction>(
    "Transaction",
    transactionSchema
  );
