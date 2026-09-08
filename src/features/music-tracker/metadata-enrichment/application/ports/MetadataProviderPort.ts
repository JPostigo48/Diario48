import type {
  MusicSourceProvider,
  SongMetadataConfidence,
  SongMetadataEvidence,
} from "@/lib/music-tracker/types";

export interface MetadataLookupRequest {
  ownerId: string;
  songId: string;
  title: string;
  artist: string;
}

export interface MetadataLookupResult {
  provider: MusicSourceProvider;
  suggestedTitle: string;
  suggestedArtist: string;
  suggestedAlbum: string;
  suggestedYear?: number;
  suggestedGenres: string[];
  suggestedTags: string[];
  suggestedMoods: string[];
  confidence: SongMetadataConfidence;
  sourcePayload?: Record<string, unknown>;
}

export interface MetadataProviderPort {
  lookupSongMetadata(request: MetadataLookupRequest): Promise<MetadataLookupResult | null>;
}

export interface SongMetadataEvidenceRepositoryPort {
  saveEvidence(ownerId: string, evidence: SongMetadataEvidence): Promise<SongMetadataEvidence>;
}
