import "server-only";

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const PASSWORD_HASH_PREFIX = "scrypt";
const SALT_LENGTH_BYTES = 16;
const KEY_LENGTH_BYTES = 64;

export async function hashPassword(password: string) {
  const normalizedPassword = password.normalize("NFKC");
  const salt = randomBytes(SALT_LENGTH_BYTES).toString("hex");
  const derivedKey = (await scrypt(normalizedPassword, salt, KEY_LENGTH_BYTES)) as Buffer;

  return `${PASSWORD_HASH_PREFIX}$${salt}$${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [prefix, salt, storedHashHex] = passwordHash.split("$");

  if (prefix !== PASSWORD_HASH_PREFIX || !salt || !storedHashHex) {
    return false;
  }

  const normalizedPassword = password.normalize("NFKC");
  const storedHash = Buffer.from(storedHashHex, "hex");
  const derivedKey = (await scrypt(normalizedPassword, salt, storedHash.length)) as Buffer;

  if (storedHash.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedHash, derivedKey);
}
