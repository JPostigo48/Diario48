import type { AlgorithmCostRow, GraphData } from "./types";
import { findWeightedNeighbors } from "./traversal";

export type InformedFrontierEntry = {
  nodeId: string;
  g: number;
  h: number;
  f: number;
  order: number;
};

export function getNodeHeuristic(graph: GraphData, nodeId: string) {
  return graph.nodes.find((node) => node.id === nodeId)?.heuristic ?? 0;
}

export function buildInformedCostRows(
  scoreMap: Map<string, { g: number; h: number; f: number }>,
  parentMap: Record<string, string | null>,
): AlgorithmCostRow[] {
  return Array.from(scoreMap.entries())
    .sort((a, b) => a[1].f - b[1].f || a[1].g - b[1].g || a[0].localeCompare(b[0]))
    .map(([nodeId, scores]) => ({
      nodeId,
      g: scores.g,
      h: scores.h,
      f: scores.f,
      parent: parentMap[nodeId] ?? null,
    }));
}

export function buildInformedFrontierSnapshot(frontier: InformedFrontierEntry[]) {
  return [...frontier]
    .sort((a, b) => a.f - b.f || a.h - b.h || a.order - b.order || a.nodeId.localeCompare(b.nodeId))
    .map((entry) => entry.nodeId);
}

export function relaxNeighbor(
  graph: GraphData,
  currentNodeId: string,
  currentG: number,
  frontier: InformedFrontierEntry[],
  scoreMap: Map<string, { g: number; h: number; f: number }>,
  parentMap: Record<string, string | null>,
  orderRef: { current: number },
  strategy: "greedy" | "astar",
) {
  const updates: string[] = [];
  const explored: { edgeId: string; neighbor: string }[] = [];

  for (const { edgeId, neighbor, weight } of findWeightedNeighbors(graph, currentNodeId)) {
    explored.push({ edgeId, neighbor });

    const nextG = currentG + weight;
    const nextH = getNodeHeuristic(graph, neighbor);
    const nextF = strategy === "astar" ? nextG + nextH : nextH;
    const previous = scoreMap.get(neighbor);

    const shouldUpdate =
      !previous ||
      nextF < previous.f ||
      (nextF === previous.f && nextG < previous.g);

    if (!shouldUpdate) {
      continue;
    }

    scoreMap.set(neighbor, { g: nextG, h: nextH, f: nextF });
    parentMap[neighbor] = currentNodeId;
    frontier.push({
      nodeId: neighbor,
      g: nextG,
      h: nextH,
      f: nextF,
      order: orderRef.current,
    });
    orderRef.current += 1;
    updates.push(`${neighbor}(g=${nextG}, h=${nextH}, f=${nextF})`);
  }

  return { updates, explored };
}
