import type { Song, SongDuplicateCase } from "@/lib/music-tracker/types";

export interface DuplicateDetectionRequest {
  ownerId: string;
  baseSong: Song;
  candidates: Song[];
}

export interface DuplicateSuggestion {
  candidateSongIds: string[];
  suspicionScore: number;
  reasons: string[];
}

export interface DuplicateDetectionPort {
  detect(request: DuplicateDetectionRequest): Promise<DuplicateSuggestion[]>;
}

export interface SongDuplicateCaseRepositoryPort {
  save(ownerId: string, duplicateCase: SongDuplicateCase): Promise<SongDuplicateCase>;
  list(ownerId: string, status?: SongDuplicateCase["status"]): Promise<SongDuplicateCase[]>;
}
