import type { MusicProviderCredential } from "@/lib/music-tracker/types";
import type { MusicProviderCredentialDocument } from "@/lib/models/MusicProviderCredential";

export function mapMusicProviderCredentialDocumentToEntity(
  document: MusicProviderCredentialDocument,
): MusicProviderCredential {
  return {
    id: String(document._id),
    ownerId: document.ownerId,
    provider: document.provider,
    encryptedSecret: document.encryptedSecret,
    status: document.status,
    lastValidatedAt: document.lastValidatedAt?.toISOString(),
    lastSyncAt: document.lastSyncAt?.toISOString(),
    lastError: document.lastError,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}
