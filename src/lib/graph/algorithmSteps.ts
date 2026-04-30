import { runBfs } from "./bfs";
import { runDfs } from "./dfs";
import { runAStar } from "./astar";
import { runAntColony } from "./antColony";
import { runGreedyBestFirst } from "./greedyBestFirst";
import { runGreedyColoring } from "./greedyColoring";
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
    type: "greedy-best-first",
    label: "Best",
    secondaryLabel: "First",
    available: true,
  },
  {
    id: "astar",
    type: "astar",
    label: "A*",
    secondaryLabel: "estrella",
    available: true,
  },
  {
    id: "greedy-coloring",
    type: "graph-coloring",
    label: "Greedy",
    secondaryLabel: "Coloring",
    available: true,
  },
  {
    id: "ant-colony",
    type: "ant-colony",
    label: "AntCol",
    secondaryLabel: "Coloring",
    available: true,
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
      return startNode ? runAStar(graph, startNode, goalNode) : [];
    case "greedy-best-first":
      return startNode ? runGreedyBestFirst(graph, startNode, goalNode) : [];
    case "graph-coloring":
      return runGreedyColoring(graph);
    case "ant-colony":
      return runAntColony(graph);
    default:
      return [];
  }
}
