import { notFound, redirect } from "next/navigation";
import ResearchReadonlyPage from "@/components/research/ResearchReadonlyPage";
import ResearchToolPage from "@/components/research/ResearchToolPage";
import { getCurrentUser } from "@/lib/auth/session";
import { getAccessibleResearchWorkspaceById } from "@/lib/research/repository";

type PapersReviewResourcePageProps = {
  params: Promise<{ id: string }>;
};

export default async function PapersReviewResourcePage({
  params,
}: PapersReviewResourcePageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  const access = await getAccessibleResearchWorkspaceById(
    id,
    user ? String(user._id) : null,
  );

  if (!access) {
    if (!user) {
      redirect(`/login?next=${encodeURIComponent(`/tools/papers-review/${id}`)}`);
    }

    notFound();
  }

  if (access.accessMode === "owner") {
    return <ResearchToolPage initialWorkspaceId={id} />;
  }

  return <ResearchReadonlyPage workspace={access.workspace} />;
}
