import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const CREDENTIAL_SECRET_ENV_KEYS = [
  "MUSIC_TRACKER_CREDENTIALS_SECRET",
  "MUSIC_TRACKER_SECRET_KEY",
] as const;

function getCredentialSecretValue() {
  for (const envKey of CREDENTIAL_SECRET_ENV_KEYS) {
    const value = process.env[envKey];
    if (value?.trim()) {
      return value.trim();
    }
  }

  throw new Error(
    "Falta configurar MUSIC_TRACKER_CREDENTIALS_SECRET para cifrar las credenciales de YT Music.",
  );
}

function getCredentialEncryptionKey() {
  return createHash("sha256").update(getCredentialSecretValue()).digest();
}

export function encryptProviderSecret(plainText: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getCredentialEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `v1.${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptProviderSecret(payload: string) {
  const [version, ivBase64, tagBase64, encryptedBase64] = payload.split(".");

  if (version !== "v1" || !ivBase64 || !tagBase64 || !encryptedBase64) {
    throw new Error("La credencial almacenada tiene un formato de cifrado invÃ¡lido.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getCredentialEncryptionKey(),
    Buffer.from(ivBase64, "base64url"),
  );

  decipher.setAuthTag(Buffer.from(tagBase64, "base64url"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, "base64url")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function normalizeCredentialPayload(rawValue: string) {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    throw new Error("Debes pegar el contenido de la credencial de YT Music.");
  }

  if (trimmed.length > 1_000_000) {
    throw new Error("La credencial es demasiado grande para almacenarse de forma segura.");
  }

  try {
    return JSON.stringify(JSON.parse(trimmed));
  } catch {
    return trimmed;
  }
}

type CredentialValidationResult = {
  status: "valid" | "invalid";
  reason: string;
};

export function validateYtMusicCredentialPayload(rawValue: string): CredentialValidationResult {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return {
      status: "invalid",
      reason: "La credencial estÃ¡ vacÃ­a.",
    };
  }

  const looksLikeHeaderKey = (value: string) =>
    /cookie|user-agent|authorization|x-goog|visitor/i.test(value);

  const looksLikeCookieValue = (value: string) =>
    /SAPISID|HSID|SSID|APISID|SID=|__Secure-1PAPISID/i.test(value);

  try {
    const parsed = JSON.parse(trimmed) as unknown;

    if (Array.isArray(parsed) && parsed.length > 0) {
      return {
        status: "valid",
        reason: "La credencial tiene estructura JSON y contenido no vacÃ­o.",
      };
    }

    if (parsed && typeof parsed === "object") {
      const entries = Object.entries(parsed as Record<string, unknown>);
      const hasRelevantKey = entries.some(([key]) => looksLikeHeaderKey(key));
      const hasRelevantValue = entries.some(([, value]) =>
        typeof value === "string" ? looksLikeCookieValue(value) : false,
      );

      if (hasRelevantKey || hasRelevantValue) {
        return {
          status: "valid",
          reason: "La credencial contiene campos compatibles con headers/cookies de YT Music.",
        };
      }
    }
  } catch {
    if (looksLikeCookieValue(trimmed) || /User-Agent/i.test(trimmed)) {
      return {
        status: "valid",
        reason: "La credencial tiene formato textual y contiene cookies/headers reconocibles.",
      };
    }
  }

  return {
    status: "invalid",
    reason: "No se reconocieron cookies o headers compatibles con YT Music.",
  };
}
