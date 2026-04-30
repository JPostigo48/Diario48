export type AlgorithmType =
  | "bfs"
  | "dfs"
  | "uniform-cost"
  | "greedy-best-first"
  | "astar"
  | "graph-coloring"
  | "ant-colony";

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
  isDirected: boolean;
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
  costRows?: AlgorithmCostRow[];
  detailTable?: AlgorithmDetailTable;
  nodeVisuals?: Record<string, AlgorithmNodeVisual>;
}

export interface AlgorithmCostRow {
  nodeId: string;
  g: number;
  h?: number;
  f?: number;
  parent?: string | null;
}

export interface AlgorithmDetailTable {
  title: string;
  columns: string[];
  rows: Array<Array<string | number>>;
}

export interface AlgorithmNodeVisual {
  fillColor: string;
  borderColor?: string;
  textColor?: string;
}

export interface AlgorithmOption {
  id: string;
  type?: AlgorithmType;
  label: string;
  secondaryLabel?: string;
  available: boolean;
}

export type SelectedGraphElement =
  | { type: "node"; id: string }
  | { type: "edge"; id: string }
  | null;
