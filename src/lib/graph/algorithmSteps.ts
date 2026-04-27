import { runBfs } from "./bfs";
import type { AlgorithmOption, AlgorithmStep, AlgorithmType, GraphData } from "./types";

export const algorithmOptions: AlgorithmOption[] = [
  { type: "bfs", label: "BFS", available: true },
  { type: "dfs", label: "DFS", available: false },
  { type: "astar", label: "A*", available: false },
  { type: "greedy-best-first", label: "Greedy", available: false },
  { type: "graph-coloring", label: "Coloreo", available: false },
];

export function runAlgorithm(
  type: AlgorithmType,
  graph: GraphData,
  startNode?: string,
  goalNode?: string,
): AlgorithmStep[] {
  switch (type) {
    case "bfs":
      return startNode ? runBfs(graph, startNode, goalNode) : [];
    case "dfs":
    case "astar":
    case "greedy-best-first":
    case "graph-coloring":
      return [];
    default:
      return [];
  }
}
