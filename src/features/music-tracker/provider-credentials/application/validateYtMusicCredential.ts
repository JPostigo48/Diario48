import {
  decryptProviderSecret,
  validateYtMusicCredentialPayload,
} from "@/lib/music-tracker/providerCredentials.server";
import type { MusicProviderCredentialSummary } from "@/lib/music-tracker/types";
import type { MusicProviderCredentialRepositoryPort } from "@/features/music-tracker/provider-credentials/application/ports/MusicProviderCredentialRepositoryPort";
import { toCredentialSummary } from "@/features/music-tracker/provider-credentials/application/toSummary";

export async function validateYtMusicCredential(input: {
  ownerId: string;
  repository: MusicProviderCredentialRepositoryPort;
}): Promise<MusicProviderCredentialSummary> {
  const current = await input.repository.getByOwnerAndProvider(input.ownerId, "ytmusic");

  if (!current) {
    throw new Error("No existe una credencial de YT Music configurada para este usuario.");
  }

  const decrypted = decryptProviderSecret(current.encryptedSecret);
  const validation = validateYtMusicCredentialPayload(decrypted);
  const now = new Date().toISOString();

  const saved = await input.repository.save({
    ownerId: input.ownerId,
    credential: {
      ...current,
      status: validation.status,
      lastValidatedAt: now,
      lastError: validation.status === "valid" ? "" : validation.reason,
    },
  });

  return toCredentialSummary(saved, "ytmusic");
}
