import "server-only";

import mongoose, { Model, Schema } from "mongoose";
import { normalizeEmail } from "@/lib/auth/email";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      set: normalizeEmail,
    },
    passwordHash: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    displayName: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

UserSchema.index({ email: 1 }, { unique: true });

export interface UserDocument extends mongoose.Document {
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserModel =
  (mongoose.models.User as Model<UserDocument> | undefined) ??
  mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
