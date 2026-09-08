import type {
  MusicProviderCredential,
  MusicProviderCredentialProvider,
  MusicProviderCredentialSummary,
} from "@/lib/music-tracker/types";

export function toCredentialSummary(
  credential: MusicProviderCredential | null,
  provider: MusicProviderCredentialProvider,
): MusicProviderCredentialSummary {
  if (!credential) {
    return {
      provider,
      hasCredential: false,
      status: "not-configured",
      lastError: "",
    };
  }

  return {
    provider: credential.provider,
    hasCredential: true,
    status: credential.status,
    lastValidatedAt: credential.lastValidatedAt,
    lastSyncAt: credential.lastSyncAt,
    lastError: credential.lastError,
    updatedAt: credential.updatedAt,
  };
}
