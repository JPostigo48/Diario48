import type { SongReviewTask } from "@/lib/music-tracker/types";

export interface SongReviewTaskQuery {
  ownerId: string;
  status?: SongReviewTask["status"];
  priority?: SongReviewTask["priority"];
  action?: SongReviewTask["action"];
  songId?: string;
}

export interface SongReviewTaskRepositoryPort {
  list(query: SongReviewTaskQuery): Promise<SongReviewTask[]>;
  save(ownerId: string, task: SongReviewTask): Promise<SongReviewTask>;
}
