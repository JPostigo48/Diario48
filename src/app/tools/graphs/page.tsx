import GraphEmptyPage from "@/components/graph/GraphEmptyPage";
import GraphToolPage from "@/components/graph/GraphToolPage";
import { getCurrentUser } from "@/lib/auth/session";

export default async function GraphsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <GraphEmptyPage />;
  }

  return <GraphToolPage />;
}
