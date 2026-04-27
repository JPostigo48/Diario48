import { runBfs } from "./bfs";
import { runDfs } from "./dfs";
import { runUniformCost } from "./uniformCost";
import type { AlgorithmOption, AlgorithmStep, AlgorithmType, GraphData } from "./types";

export const algorithmOptions: AlgorithmOption[] = [
  { id: "bfs", type: "bfs", label: "BFS", available: true },
  { id: "dfs", type: "dfs", label: "DFS", available: true },
  {
    id: "uniform-cost",
    type: "uniform-cost",
    label: "Costo",
    secondaryLabel: "uniforme",
    available: true,
  },
  {
    id: "best-first",
    label: "Best",
    secondaryLabel: "First",
    available: false,
  },
  {
    id: "astar",
    type: "astar",
    label: "A*",
    secondaryLabel: "estrella",
    available: false,
  },
  {
    id: "greedy-coloring",
    label: "Greedy",
    secondaryLabel: "Coloring",
    available: false,
  },
  {
    id: "ant-colony",
    label: "Ant",
    secondaryLabel: "Col.",
    available: false,
  },
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
      return startNode ? runDfs(graph, startNode, goalNode) : [];
    case "uniform-cost":
      return startNode ? runUniformCost(graph, startNode, goalNode) : [];
    case "astar":
    case "greedy-best-first":
    case "graph-coloring":
      return [];
    default:
      return [];
  }
}
