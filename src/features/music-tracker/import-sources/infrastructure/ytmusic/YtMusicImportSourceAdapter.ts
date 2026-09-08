import "server-only";

import { decryptProviderSecret } from "@/lib/music-tracker/providerCredentials.server";
import type { MusicProviderCredentialRepositoryPort } from "@/features/music-tracker/provider-credentials/application/ports/MusicProviderCredentialRepositoryPort";
import type {
  ImportPlaylistRequest,
  ImportSourcePort,
} from "@/features/music-tracker/import-sources/application/ports/ImportSourcePort";
import {
  mapYtMusicPlaylistDtoToSnapshot,
  mapYtMusicSearchTrackDtoToSummary,
  mapYtMusicSourceDtoToSummary,
} from "@/features/music-tracker/import-sources/infrastructure/ytmusic/mappers";
import { YtMusicPythonBridge } from "@/features/music-tracker/import-sources/infrastructure/ytmusic/YtMusicPythonBridge";

export class YtMusicImportSourceAdapter implements ImportSourcePort {
  constructor(
    private readonly credentialRepository: MusicProviderCredentialRepositoryPort,
    private readonly pythonBridge = new YtMusicPythonBridge(),
  ) {}

  async listSources(ownerId: string) {
    const auth = await this.getCredential(ownerId);
    const { likedSongs, playlists } = await this.pythonBridge.listSources(auth);

    return [
      mapYtMusicSourceDtoToSummary(likedSongs),
      ...playlists.map(mapYtMusicSourceDtoToSummary),
    ];
  }

  async searchTracks(ownerId: string, query: string, limit = 10) {
    const auth = await this.getCredential(ownerId);
    const results = await this.pythonBridge.searchTracks(auth, query, limit);
    return results.map(mapYtMusicSearchTrackDtoToSummary);
  }

  async importPlaylist(request: ImportPlaylistRequest) {
    if (request.provider !== "ytmusic") {
      throw new Error("El adaptador de YT Music solo soporta provider ytmusic.");
    }

    const auth = await this.getCredential(request.ownerId);
    const playlist = await this.pythonBridge.loadPlaylist(auth, request.sourceRef);
    return mapYtMusicPlaylistDtoToSnapshot(playlist);
  }

  private async getCredential(ownerId: string) {
    const credential = await this.credentialRepository.getByOwnerAndProvider(ownerId, "ytmusic");

    if (!credential) {
      throw new Error("Primero debes configurar una credencial de YT Music.");
    }

    return decryptProviderSecret(credential.encryptedSecret);
  }
}
