import { getCurrentUser } from "@/lib/auth/session";
import MusicTrackerEmptyPage from "@/features/music-tracker/presentation/MusicTrackerEmptyPage";
import MusicTrackerPage from "@/features/music-tracker/presentation/MusicTrackerPage";

export default async function MusicTrackerToolPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <MusicTrackerEmptyPage />;
  }

  return <MusicTrackerPage />;
}
