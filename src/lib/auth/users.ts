import "server-only";

import { connectToDatabase } from "@/lib/db/mongodb";
import UserModel, { type UserDocument } from "@/lib/models/User";
import {
  DEFAULT_BOOTSTRAP_USER_DISPLAY_NAME,
  getBootstrapUserEmail,
  getBootstrapUserPassword,
} from "@/lib/auth/constants";
import { normalizeEmail } from "@/lib/auth/email";
import { hashPassword } from "@/lib/auth/passwords";

export async function findUserByEmail(email: string) {
  await connectToDatabase();

  const normalizedEmail = normalizeEmail(email);

  return UserModel.findOne({ email: normalizedEmail }).exec();
}

export async function findUserByEmailForAuth(email: string) {
  await connectToDatabase();

  const normalizedEmail = normalizeEmail(email);

  return UserModel.findOne({ email: normalizedEmail }).select("+passwordHash").exec();
}

export async function findUserById(userId: string) {
  await connectToDatabase();

  return UserModel.findById(userId).exec();
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  displayName?: string;
}) {
  await connectToDatabase();

  const normalizedEmail = normalizeEmail(input.email);

  const created = await UserModel.create({
    email: normalizedEmail,
    passwordHash: input.passwordHash,
    displayName: input.displayName?.trim() || "",
  });

  return created as UserDocument;
}

export async function ensureDefaultUserExists() {
  await connectToDatabase();

  const bootstrapEmail = normalizeEmail(getBootstrapUserEmail());

  const existingUser = await UserModel.findOne({
    email: bootstrapEmail,
  }).exec();

  if (existingUser) {
    return existingUser;
  }

  const passwordHash = await hashPassword(getBootstrapUserPassword());

  const created = await UserModel.create({
    email: bootstrapEmail,
    passwordHash,
    displayName: DEFAULT_BOOTSTRAP_USER_DISPLAY_NAME,
  });

  return created as UserDocument;
}
