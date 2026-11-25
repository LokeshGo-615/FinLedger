
import mongoose, { Schema } from "mongoose";

import {
  LEDGER_DIRECTIONS,
  LEDGER_ACCOUNT_KINDS,
} from "./ledger.types.js";

import type {
  ILedgerEntry,
} from "./ledger.types.js";

import { MAX_BALANCE } from "../../utils/money.js";

const ledgerSchema = new Schema<ILedgerEntry>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
      immutable: true,
    },

    accountKind: {
      type: String,
      enum: LEDGER_ACCOUNT_KINDS,
      required: true,
      immutable: true,
    },

    accountId: {
      type: Schema.Types.ObjectId,
      required: true,
      immutable: true,
    },

    direction: {
      type: String,
      enum: LEDGER_DIRECTIONS,
      required: true,
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
        message: "Ledger amount must be an integer",
      },
    },

    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
      required: true,
      immutable: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
  }
);

ledgerSchema.index({
  transactionId: 1,
});

ledgerSchema.index({
  accountId: 1,
  createdAt: -1,
});

export const LedgerEntry =
  mongoose.model<ILedgerEntry>(
    "LedgerEntry",
    ledgerSchema
  );
