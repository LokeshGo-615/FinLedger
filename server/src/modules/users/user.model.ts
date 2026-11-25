
import mongoose, { Schema } from "mongoose";

import {
  UserRole,
  UserStatus
} from "./user.types.js";

import type { IUser } from "./user.types.js";

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE
    },

    activeAccountCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Account count must be an integer"
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const User = mongoose.model<IUser>(
  "User",
  userSchema
);
