import type { MusicProviderCredentialRepositoryPort } from "@/features/music-tracker/provider-credentials/application/ports/MusicProviderCredentialRepositoryPort";

export async function deleteYtMusicCredential(input: {
  ownerId: string;
  repository: MusicProviderCredentialRepositoryPort;
}) {
  await input.repository.delete(input.ownerId, "ytmusic");
}
