import "server-only";

import { connectToDatabase } from "@/lib/db/mongodb";
import SongModel from "@/lib/models/Song";
import type { Song } from "@/lib/music-tracker/types";
import type {
  ListSongsQuery,
  SaveSongInput,
  SongRepositoryPort,
} from "@/features/music-tracker/library-core/application/ports/SongRepositoryPort";
import { mapSongDocumentToEntity } from "@/features/music-tracker/library-core/infrastructure/mappers";

function buildSongListFilter(query: ListSongsQuery) {
  const filter: Record<string, unknown> = {
    ownerId: query.ownerId,
  };

  if (query.organizationState) {
    filter.organizationState = query.organizationState;
  }

  if (query.reviewState) {
    filter.reviewState = query.reviewState;
  }

  if (query.metadataConfidence) {
    filter.metadataConfidence = query.metadataConfidence;
  }

  if (query.duplicateStatus) {
    filter.duplicateStatus = query.duplicateStatus;
  }

  if (query.searchText?.trim()) {
    filter.$or = [
      { canonicalTitle: { $regex: query.searchText.trim(), $options: "i" } },
      { canonicalArtist: { $regex: query.searchText.trim(), $options: "i" } },
      { manualTitle: { $regex: query.searchText.trim(), $options: "i" } },
      { manualArtist: { $regex: query.searchText.trim(), $options: "i" } },
    ];
  }

  return filter;
}

export class MongoSongRepository implements SongRepositoryPort {
  async getById(ownerId: string, songId: string): Promise<Song | null> {
    await connectToDatabase();

    const document = await SongModel.findOne({ _id: songId, ownerId }).exec();
    return document ? mapSongDocumentToEntity(document) : null;
  }

  async findByExternalTrack(ownerId: string, provider: import("@/lib/music-tracker/types").MusicSourceProvider, externalTrackId: string) {
    await connectToDatabase();

    const document = await SongModel.findOne({
      ownerId,
      externalLinks: {
        $elemMatch: {
          provider,
          externalId: externalTrackId,
        },
      },
    }).exec();

    return document ? mapSongDocumentToEntity(document) : null;
  }

  async findBySourceUrl(ownerId: string, sourceUrl: string) {
    await connectToDatabase();

    const document = await SongModel.findOne({
      ownerId,
      externalLinks: {
        $elemMatch: {
          url: sourceUrl,
        },
      },
    }).exec();

    return document ? mapSongDocumentToEntity(document) : null;
  }

  async findByCanonicalIdentity(ownerId: string, canonicalTitle: string, canonicalArtist: string) {
    await connectToDatabase();

    const document = await SongModel.findOne({
      ownerId,
      canonicalTitle: { $regex: `^${escapeRegex(canonicalTitle)}$`, $options: "i" },
      canonicalArtist: { $regex: `^${escapeRegex(canonicalArtist)}$`, $options: "i" },
    }).exec();

    return document ? mapSongDocumentToEntity(document) : null;
  }

  async list(query: ListSongsQuery): Promise<Song[]> {
    await connectToDatabase();

    const documents = await SongModel.find(buildSongListFilter(query))
      .sort({ updatedAt: -1, canonicalArtist: 1, canonicalTitle: 1 })
      .exec();

    return documents.map(mapSongDocumentToEntity);
  }

  async save(input: SaveSongInput): Promise<Song> {
    await connectToDatabase();

    const payload = {
      ownerId: input.ownerId,
      canonicalTitle: input.song.canonicalTitle,
      canonicalArtist: input.song.canonicalArtist,
      manualTitle: input.song.manualTitle,
      manualArtist: input.song.manualArtist,
      album: input.song.album,
      year: input.song.year,
      rating: input.song.rating,
      personalNote: input.song.personalNote,
      isRealFavorite: input.song.isRealFavorite,
      organizationState: input.song.organizationState,
      reviewState: input.song.reviewState,
      metadataConfidence: input.song.metadataConfidence,
      duplicateStatus: input.song.duplicateStatus,
      externalLinks: input.song.externalLinks,
      tags: input.song.tags,
    };

    const document = input.song.id
      ? await SongModel.findOneAndUpdate(
          { _id: input.song.id, ownerId: input.ownerId },
          payload,
          { new: true, runValidators: true },
        ).exec()
      : await SongModel.create(payload);

    if (!document) {
      throw new Error("No se pudo persistir la canción.");
    }

    return mapSongDocumentToEntity(document);
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
