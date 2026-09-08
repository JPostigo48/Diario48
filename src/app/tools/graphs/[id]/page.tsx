import { notFound, redirect } from "next/navigation";
import GraphReadonlyPage from "@/components/graph/GraphReadonlyPage";
import GraphToolPage from "@/components/graph/GraphToolPage";
import { getCurrentUser } from "@/lib/auth/session";
import { getGraphAccessContext } from "@/lib/graph/access";

type GraphResourcePageProps = {
  params: Promise<{ id: string }>;
};

export default async function GraphResourcePage({ params }: GraphResourcePageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  const access = await getGraphAccessContext(id, user ? String(user._id) : null);

  if (!access) {
    if (!user) {
      redirect(`/login?next=${encodeURIComponent(`/tools/graphs/${id}`)}`);
    }

    notFound();
  }

  if (access.accessMode === "owner") {
    return <GraphToolPage initialGraph={access.graph} />;
  }

  return <GraphReadonlyPage graph={access.graph} />;
}
