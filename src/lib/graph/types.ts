export type AlgorithmType =
  | "bfs"
  | "dfs"
  | "greedy-best-first"
  | "astar"
  | "graph-coloring";

export type NodeVisualState =
  | "unvisited"
  | "current"
  | "visited"
  | "frontier"
  | "path";

export type EdgeVisualState = "normal" | "explored" | "path";

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  heuristic?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
}

export interface GraphData {
  id?: string;
  name: string;
  description?: string;
  isPublic: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNode?: string;
  goalNode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlgorithmStep {
  stepNumber: number;
  actionLabel: string;
  description: string;
  currentNode: string | null;
  visited: string[];
  frontier: string[];
  exploredEdges: string[];
  path: string[];
  nodeStates: Record<string, NodeVisualState>;
  edgeStates: Record<string, EdgeVisualState>;
}

export interface AlgorithmOption {
  type: AlgorithmType;
  label: string;
  available: boolean;
}
