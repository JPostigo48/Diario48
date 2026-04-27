import type {
  AlgorithmStep,
  EdgeVisualState,
  GraphData,
  NodeVisualState,
} from "./types";

export function createNodeStateMap(
  graph: GraphData,
): Record<string, NodeVisualState> {
  return Object.fromEntries(graph.nodes.map((node) => [node.id, "unvisited"]));
}

export function createEdgeStateMap(
  graph: GraphData,
): Record<string, EdgeVisualState> {
  return Object.fromEntries(graph.edges.map((edge) => [edge.id, "normal"]));
}

export function findNeighbors(graph: GraphData, nodeId: string) {
  return graph.edges
    .filter((edge) => edge.source === nodeId || edge.target === nodeId)
    .map((edge) => ({
      edgeId: edge.id,
      neighbor: edge.source === nodeId ? edge.target : edge.source,
    }));
}

export function reconstructPath(
  parentMap: Record<string, string | null>,
  goalId: string,
) {
  const path: string[] = [];
  let cursor: string | null = goalId;

  while (cursor) {
    path.unshift(cursor);
    cursor = parentMap[cursor] ?? null;
  }

  return path;
}

export function createPathEdgeIds(graph: GraphData, path: string[]) {
  const edgeIds: string[] = [];

  for (let index = 0; index < path.length - 1; index += 1) {
    const current = path[index];
    const next = path[index + 1];
    const edge = graph.edges.find(
      (candidate) =>
        (candidate.source === current && candidate.target === next) ||
        (candidate.source === next && candidate.target === current),
    );

    if (edge) {
      edgeIds.push(edge.id);
    }
  }

  return edgeIds;
}

export function createEmptyAlgorithmResult() {
  return [] satisfies AlgorithmStep[];
}
