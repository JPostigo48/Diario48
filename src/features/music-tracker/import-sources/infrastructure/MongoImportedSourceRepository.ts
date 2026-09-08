import "server-only";

import { connectToDatabase } from "@/lib/db/mongodb";
import ImportedPlaylistSourceModel from "@/lib/models/ImportedPlaylistSource";
import ImportedTrackSourceModel from "@/lib/models/ImportedTrackSource";
import SongPlaylistOccurrenceModel from "@/lib/models/SongPlaylistOccurrence";
import type {
  ImportedSourceRepositoryPort,
  SaveImportedPlaylistInput,
  SaveImportedTrackInput,
  SaveSongPlaylistOccurrenceInput,
} from "@/features/music-tracker/import-sources/application/ports/ImportedSourceRepositoryPort";
import {
  mapImportedPlaylistSourceDocumentToEntity,
  mapImportedTrackSourceDocumentToEntity,
  mapSongPlaylistOccurrenceDocumentToEntity,
} from "@/features/music-tracker/import-sources/infrastructure/mappers";

export class MongoImportedSourceRepository implements ImportedSourceRepositoryPort {
  async savePlaylist(input: SaveImportedPlaylistInput) {
    await connectToDatabase();

    const document = input.playlist.id
      ? await ImportedPlaylistSourceModel.findOneAndUpdate(
          { _id: input.playlist.id, ownerId: input.ownerId },
          { ...input.playlist, ownerId: input.ownerId },
          { new: true, runValidators: true },
        ).exec()
      : await ImportedPlaylistSourceModel.create({
          ...input.playlist,
          ownerId: input.ownerId,
        });

    if (!document) {
      throw new Error("No se pudo persistir la playlist importada.");
    }

    return mapImportedPlaylistSourceDocumentToEntity(document);
  }

  async saveTrack(input: SaveImportedTrackInput) {
    await connectToDatabase();

    const document = input.track.id
      ? await ImportedTrackSourceModel.findOneAndUpdate(
          { _id: input.track.id, ownerId: input.ownerId },
          { ...input.track, ownerId: input.ownerId },
          { new: true, runValidators: true },
        ).exec()
      : await ImportedTrackSourceModel.create({
          ...input.track,
          ownerId: input.ownerId,
        });

    if (!document) {
      throw new Error("No se pudo persistir el track importado.");
    }

    return mapImportedTrackSourceDocumentToEntity(document);
  }

  async saveOccurrence(input: SaveSongPlaylistOccurrenceInput) {
    await connectToDatabase();

    const document = input.occurrence.id
      ? await SongPlaylistOccurrenceModel.findOneAndUpdate(
          { _id: input.occurrence.id, ownerId: input.ownerId },
          { ...input.occurrence, ownerId: input.ownerId },
          { new: true, runValidators: true },
        ).exec()
      : await SongPlaylistOccurrenceModel.create({
          ...input.occurrence,
          ownerId: input.ownerId,
        });

    if (!document) {
      throw new Error("No se pudo persistir la ocurrencia canción-playlist.");
    }

    return mapSongPlaylistOccurrenceDocumentToEntity(document);
  }

  async listPlaylists(ownerId: string) {
    await connectToDatabase();

    const documents = await ImportedPlaylistSourceModel.find({ ownerId })
      .sort({ importedAt: -1, updatedAt: -1 })
      .exec();

    return documents.map(mapImportedPlaylistSourceDocumentToEntity);
  }

  async listTracks(query: import("@/features/music-tracker/import-sources/application/ports/ImportedSourceRepositoryPort").ImportedTrackQuery) {
    await connectToDatabase();

    const filter: Record<string, unknown> = { ownerId: query.ownerId };
    if (query.songId) {
      filter.songId = query.songId;
    }
    if (query.playlistSourceId) {
      filter.playlistSourceId = query.playlistSourceId;
    }

    const documents = await ImportedTrackSourceModel.find(filter)
      .sort({ importedAt: -1, updatedAt: -1, playlistPosition: 1 })
      .exec();

    return documents.map(mapImportedTrackSourceDocumentToEntity);
  }

  async listOccurrences(query: import("@/features/music-tracker/import-sources/application/ports/ImportedSourceRepositoryPort").SongPlaylistOccurrenceQuery) {
    await connectToDatabase();

    const filter: Record<string, unknown> = { ownerId: query.ownerId };
    if (query.songId) {
      filter.songId = query.songId;
    }
    if (query.playlistSourceId) {
      filter.playlistSourceId = query.playlistSourceId;
    }

    const documents = await SongPlaylistOccurrenceModel.find(filter)
      .sort({ updatedAt: -1, playlistSourceId: 1 })
      .exec();

    return documents.map(mapSongPlaylistOccurrenceDocumentToEntity);
  }

  async findOccurrenceBySongAndPlaylist(ownerId: string, songId: string, playlistSourceId: string) {
    await connectToDatabase();

    const document = await SongPlaylistOccurrenceModel.findOne({
      ownerId,
      songId,
      playlistSourceId,
    }).exec();

    return document ? mapSongPlaylistOccurrenceDocumentToEntity(document) : null;
  }

  async findPlaylistByExternalRef(
    ownerId: string,
    provider: import("@/lib/music-tracker/types").MusicSourceProvider,
    externalPlaylistId: string,
  ) {
    await connectToDatabase();

    const document = await ImportedPlaylistSourceModel.findOne({
      ownerId,
      provider,
      externalPlaylistId,
    })
      .sort({ updatedAt: -1 })
      .exec();

    return document ? mapImportedPlaylistSourceDocumentToEntity(document) : null;
  }

  async findTrackByExternalRef(
    ownerId: string,
    provider: import("@/lib/music-tracker/types").MusicSourceProvider,
    externalTrackId: string,
    playlistSourceId?: string,
  ) {
    await connectToDatabase();

    const filter: Record<string, unknown> = {
      ownerId,
      provider,
      externalTrackId,
    };

    if (playlistSourceId) {
      filter.playlistSourceId = playlistSourceId;
    }

    const document = await ImportedTrackSourceModel.findOne(filter)
      .sort({ updatedAt: -1 })
      .exec();

    return document ? mapImportedTrackSourceDocumentToEntity(document) : null;
  }
}
