import "server-only";

import mongoose, { Model, Schema } from "mongoose";

const AuthSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    lastSeenAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "auth_sessions",
  },
);

export interface AuthSessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId | string;
  tokenHash: string;
  expiresAt: Date;
  lastSeenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const AuthSessionModel =
  (mongoose.models.AuthSession as Model<AuthSessionDocument> | undefined) ??
  mongoose.model<AuthSessionDocument>("AuthSession", AuthSessionSchema);

export default AuthSessionModel;
