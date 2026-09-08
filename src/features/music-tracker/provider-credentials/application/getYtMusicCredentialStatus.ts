import type { MusicProviderCredentialSummary } from "@/lib/music-tracker/types";
import type { MusicProviderCredentialRepositoryPort } from "@/features/music-tracker/provider-credentials/application/ports/MusicProviderCredentialRepositoryPort";
import { toCredentialSummary } from "@/features/music-tracker/provider-credentials/application/toSummary";

export async function getYtMusicCredentialStatus(input: {
  ownerId: string;
  repository: MusicProviderCredentialRepositoryPort;
}): Promise<MusicProviderCredentialSummary> {
  const credential = await input.repository.getByOwnerAndProvider(input.ownerId, "ytmusic");
  return toCredentialSummary(credential, "ytmusic");
}
