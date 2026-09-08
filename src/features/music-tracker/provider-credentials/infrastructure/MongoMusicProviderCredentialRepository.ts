import "server-only";

import { connectToDatabase } from "@/lib/db/mongodb";
import MusicProviderCredentialModel from "@/lib/models/MusicProviderCredential";
import type {
  MusicProviderCredential,
  MusicProviderCredentialProvider,
} from "@/lib/music-tracker/types";
import type {
  MusicProviderCredentialRepositoryPort,
  SaveMusicProviderCredentialInput,
} from "@/features/music-tracker/provider-credentials/application/ports/MusicProviderCredentialRepositoryPort";
import { mapMusicProviderCredentialDocumentToEntity } from "@/features/music-tracker/provider-credentials/infrastructure/mappers";

export class MongoMusicProviderCredentialRepository
  implements MusicProviderCredentialRepositoryPort
{
  async getByOwnerAndProvider(ownerId: string, provider: MusicProviderCredentialProvider) {
    await connectToDatabase();

    const document = await MusicProviderCredentialModel.findOne({ ownerId, provider })
      .select("+encryptedSecret")
      .exec();

    return document ? mapMusicProviderCredentialDocumentToEntity(document) : null;
  }

  async save(input: SaveMusicProviderCredentialInput): Promise<MusicProviderCredential> {
    await connectToDatabase();

    const payload = {
      ownerId: input.ownerId,
      provider: input.credential.provider,
      encryptedSecret: input.credential.encryptedSecret,
      status: input.credential.status,
      lastValidatedAt: input.credential.lastValidatedAt
        ? new Date(input.credential.lastValidatedAt)
        : undefined,
      lastSyncAt: input.credential.lastSyncAt ? new Date(input.credential.lastSyncAt) : undefined,
      lastError: input.credential.lastError,
    };

    const document = await MusicProviderCredentialModel.findOneAndUpdate(
      {
        ownerId: input.ownerId,
        provider: input.credential.provider,
      },
      payload,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    )
      .select("+encryptedSecret")
      .exec();

    if (!document) {
      throw new Error("No se pudo guardar la credencial del proveedor musical.");
    }

    return mapMusicProviderCredentialDocumentToEntity(document);
  }

  async delete(ownerId: string, provider: MusicProviderCredentialProvider) {
    await connectToDatabase();

    await MusicProviderCredentialModel.deleteOne({ ownerId, provider }).exec();
  }
}
