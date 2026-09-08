import "server-only";

import { connectToDatabase } from "@/lib/db/mongodb";
import GraphModel from "@/lib/models/Graph";
import type { GraphData } from "@/lib/graph/types";

export type GraphAccessMode = "owner" | "readonly";

export async function getGraphAccessContext(graphId: string, viewerOwnerId?: string | null) {
  await connectToDatabase();

  const graph = await GraphModel.findById(graphId).lean();

  if (!graph) {
    return null;
  }

  const ownerId = String(graph.ownerId);
  const isOwner = Boolean(viewerOwnerId) && viewerOwnerId === ownerId;

  if (!isOwner && graph.visibility !== "link-readonly") {
    return null;
  }

  const normalizedGraph: GraphData = {
    id: String(graph._id),
    name: graph.name,
    description: graph.description,
    isPublic: graph.isPublic,
    visibility: graph.visibility,
    isDirected: graph.isDirected,
    nodes: graph.nodes,
    edges: graph.edges,
    startNode: graph.startNode,
    goalNode: graph.goalNode,
    createdAt: graph.createdAt?.toISOString(),
    updatedAt: graph.updatedAt?.toISOString(),
  };

  return {
    graph: normalizedGraph,
    accessMode: (isOwner ? "owner" : "readonly") as GraphAccessMode,
    ownerId,
  };
}
