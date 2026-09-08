import type { Song } from "@/lib/music-tracker/types";
import type { SongDocument } from "@/lib/models/Song";

export function mapSongDocumentToEntity(document: SongDocument): Song {
  return {
    id: String(document._id),
    canonicalTitle: document.canonicalTitle,
    canonicalArtist: document.canonicalArtist,
    manualTitle: document.manualTitle,
    manualArtist: document.manualArtist,
    album: document.album,
    year: document.year,
    rating: document.rating,
    personalNote: document.personalNote,
    isRealFavorite: document.isRealFavorite,
    organizationState: document.organizationState,
    reviewState: document.reviewState,
    metadataConfidence: document.metadataConfidence,
    duplicateStatus: document.duplicateStatus,
    externalLinks: document.externalLinks.map((link) => ({
      provider: link.provider,
      externalId: link.externalId,
      url: link.url,
      label: link.label,
    })),
    tags: {
      automaticTags: document.tags.automaticTags,
      personalTags: document.tags.personalTags,
      automaticGenres: document.tags.automaticGenres,
      automaticMoods: document.tags.automaticMoods,
      personalMoods: document.tags.personalMoods,
      personalUses: document.tags.personalUses,
    },
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}
