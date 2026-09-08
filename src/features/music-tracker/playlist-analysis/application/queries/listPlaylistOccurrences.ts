import type { SongPlaylistOccurrence } from "@/lib/music-tracker/types";

export interface PlaylistOccurrenceQuery {
  ownerId: string;
  songId?: string;
  playlistSourceId?: string;
}

export interface SongPlaylistOccurrenceReadPort {
  list(query: PlaylistOccurrenceQuery): Promise<SongPlaylistOccurrence[]>;
}
