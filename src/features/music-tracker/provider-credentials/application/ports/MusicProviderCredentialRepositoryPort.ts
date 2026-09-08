import type {
  MusicProviderCredential,
  MusicProviderCredentialProvider,
} from "@/lib/music-tracker/types";

export interface SaveMusicProviderCredentialInput {
  ownerId: string;
  credential: MusicProviderCredential;
}

export interface MusicProviderCredentialRepositoryPort {
  getByOwnerAndProvider(
    ownerId: string,
    provider: MusicProviderCredentialProvider,
  ): Promise<MusicProviderCredential | null>;
  save(input: SaveMusicProviderCredentialInput): Promise<MusicProviderCredential>;
  delete(ownerId: string, provider: MusicProviderCredentialProvider): Promise<void>;
}
