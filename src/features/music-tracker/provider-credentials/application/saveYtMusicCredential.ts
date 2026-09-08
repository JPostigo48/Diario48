import { encryptProviderSecret, normalizeCredentialPayload } from "@/lib/music-tracker/providerCredentials.server";
import type { MusicProviderCredentialSummary } from "@/lib/music-tracker/types";
import type { MusicProviderCredentialRepositoryPort } from "@/features/music-tracker/provider-credentials/application/ports/MusicProviderCredentialRepositoryPort";
import { toCredentialSummary } from "@/features/music-tracker/provider-credentials/application/toSummary";

export async function saveYtMusicCredential(input: {
  ownerId: string;
  rawCredential: string;
  repository: MusicProviderCredentialRepositoryPort;
}): Promise<MusicProviderCredentialSummary> {
  const normalizedPayload = normalizeCredentialPayload(input.rawCredential);
  const current = await input.repository.getByOwnerAndProvider(input.ownerId, "ytmusic");

  const saved = await input.repository.save({
    ownerId: input.ownerId,
    credential: {
      id: current?.id,
      ownerId: input.ownerId,
      provider: "ytmusic",
      encryptedSecret: encryptProviderSecret(normalizedPayload),
      status: "configured",
      lastValidatedAt: undefined,
      lastSyncAt: current?.lastSyncAt,
      lastError: "",
      createdAt: current?.createdAt,
      updatedAt: current?.updatedAt,
    },
  });

  return toCredentialSummary(saved, "ytmusic");
}
