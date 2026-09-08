import ResearchEmptyPage from "@/components/research/ResearchEmptyPage";
import ResearchToolPage from "@/components/research/ResearchToolPage";
import { getCurrentUser } from "@/lib/auth/session";

export default async function PapersReviewPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <ResearchEmptyPage />;
  }

  return <ResearchToolPage />;
}
