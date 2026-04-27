import type { GraphData } from "./types";

export const sampleGraph: GraphData = {
  name: "Grafo de ejemplo",
  description: "Grafo base para explorar BFS paso a paso en Diario48.",
  isPublic: true,
  startNode: "A",
  goalNode: "H",
  nodes: [
    { id: "A", label: "A", x: 80, y: 80, heuristic: 7 },
    { id: "B", label: "B", x: 220, y: 55, heuristic: 5 },
    { id: "C", label: "C", x: 370, y: 80, heuristic: 4 },
    { id: "D", label: "D", x: 80, y: 195, heuristic: 6 },
    { id: "E", label: "E", x: 220, y: 185, heuristic: 3 },
    { id: "F", label: "F", x: 370, y: 195, heuristic: 2 },
    { id: "G", label: "G", x: 145, y: 305, heuristic: 4 },
    { id: "H", label: "H", x: 440, y: 300, heuristic: 0 },
  ],
  edges: [
    { id: "A-B", source: "A", target: "B", weight: 4 },
    { id: "A-D", source: "A", target: "D", weight: 2 },
    { id: "B-C", source: "B", target: "C", weight: 3 },
    { id: "B-E", source: "B", target: "E", weight: 5 },
    { id: "C-F", source: "C", target: "F", weight: 1 },
    { id: "D-E", source: "D", target: "E", weight: 3 },
    { id: "D-G", source: "D", target: "G", weight: 6 },
    { id: "E-F", source: "E", target: "F", weight: 2 },
    { id: "E-G", source: "E", target: "G", weight: 4 },
    { id: "F-H", source: "F", target: "H", weight: 3 },
    { id: "G-H", source: "G", target: "H", weight: 5 },
  ],
};
