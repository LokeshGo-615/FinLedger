import { Schema, model } from "mongoose";

import {
  ACCOUNT_TYPES,
  ACCOUNT_STATUSES,
  ACCOUNT_CURRENCIES,
} from "./account.types.js";

import type { IAccount } from "./account.types.js";

import {
  MAX_BALANCE,
  isValidMoney,
} from "../../utils/money.js";

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },

    accountNumber: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      match: /^91\d{11}$/,
    },

    accountType: {
      type: String,
      enum: ACCOUNT_TYPES,
      required: true,
      immutable: true,
    },

    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: MAX_BALANCE,

      validate: {
        validator: isValidMoney,
        message:
          "Balance must be a valid integer amount in paise",
      },
    },

    currency: {
      type: String,
      enum: ACCOUNT_CURRENCIES,
      default: "INR",
      required: true,
      immutable: true,
    },

    status: {
      type: String,
      enum: ACCOUNT_STATUSES,
      default: "ACTIVE",
      required: true,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

// Database indexes
accountSchema.index({
  userId: 1,
  createdAt: -1,
});

accountSchema.index({
  userId: 1,
  status: 1,
});

export const Account = model<IAccount>(
  "Account",
  accountSchema
);