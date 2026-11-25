import mongoose, {
  Schema
} from "mongoose";

import type {
  Types
} from "mongoose";

interface IAuditLog {
  actorId: Types.ObjectId;
  action: string;
  resourceType: string;
  resourceId: Types.ObjectId;
  createdAt: Date;
}

const auditSchema = new Schema<IAuditLog>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true
    },

    action: {
      type: String,
      required: true,
      immutable: true,
      enum: [
        "ACCOUNT_FROZEN",
        "ACCOUNT_UNFROZEN",
        "ACCOUNT_CLOSED"
      ]
    },

    resourceType: {
      type: String,
      required: true,
      immutable: true,
      default: "ACCOUNT"
    },

    resourceId: {
      type: Schema.Types.ObjectId,
      required: true,
      immutable: true
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    },
    versionKey: false
  }
);

auditSchema.index({
  resourceId: 1,
  createdAt: -1
});

auditSchema.index({
  actorId: 1,
  createdAt: -1
});

export const AuditLog = mongoose.model<IAuditLog>(
  "AuditLog",
  auditSchema
);