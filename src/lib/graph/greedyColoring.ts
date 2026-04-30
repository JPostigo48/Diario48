import type { AlgorithmNodeVisual, AlgorithmStep, GraphData } from "./types";
import {
  createEdgeStateMap,
  createEmptyAlgorithmResult,
  createNodeStateMap,
  findNeighbors,
} from "./traversal";

const COLOR_PALETTE: Array<{ fill: string; border: string; text: string }> = [
  { fill: "#60a5fa", border: "#2563eb", text: "#eff6ff" },
  { fill: "#34d399", border: "#059669", text: "#ecfdf5" },
  { fill: "#fbbf24", border: "#d97706", text: "#1f2937" },
  { fill: "#f472b6", border: "#db2777", text: "#fff1f2" },
  { fill: "#a78bfa", border: "#7c3aed", text: "#f5f3ff" },
  { fill: "#fb7185", border: "#e11d48", text: "#fff1f2" },
  { fill: "#22d3ee", border: "#0891b2", text: "#ecfeff" },
  { fill: "#c4b5fd", border: "#8b5cf6", text: "#faf5ff" },
];

function getColorVisual(index: number): AlgorithmNodeVisual {
  const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
  return {
    fillColor: color.fill,
    borderColor: color.border,
    textColor: color.text,
  };
}

function buildAdjacency(graph: GraphData) {
  return new Map(
    graph.nodes.map((node) => [
      node.id,
      Array.from(new Set(findNeighbors(graph, node.id).map(({ neighbor }) => neighbor))).sort(),
    ]),
  );
}

function buildColorDetailTable(assignments: Map<string, number>, adjacency: Map<string, string[]>) {
  return {
    title: "asignación de color",
    columns: ["nodo", "color", "grado"],
    rows: Array.from(assignments.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([nodeId, color]) => [nodeId, `C${color + 1}`, adjacency.get(nodeId)?.length ?? 0]),
  };
}

export function runGreedyColoring(graph: GraphData): AlgorithmStep[] {
  if (!graph.nodes.length) {
    return createEmptyAlgorithmResult();
  }

  const adjacency = buildAdjacency(graph);
  const orderedNodes = [...graph.nodes]
    .sort((a, b) => {
      const degreeDiff = (adjacency.get(b.id)?.length ?? 0) - (adjacency.get(a.id)?.length ?? 0);
      return degreeDiff || a.id.localeCompare(b.id);
    })
    .map((node) => node.id);

  const nodeStates = createNodeStateMap(graph);
  const edgeStates = createEdgeStateMap(graph);
  const assignments = new Map<string, number>();
  const nodeVisuals: Record<string, AlgorithmNodeVisual> = {};
  const steps: AlgorithmStep[] = [];

  steps.push({
    stepNumber: 1,
    actionLabel: "inicio · greedy coloring",
    description:
      "Se ordenan los nodos por grado descendente y se asigna a cada uno el menor color disponible sin conflictos.",
    currentNode: null,
    visited: [],
    frontier: [...orderedNodes],
    exploredEdges: [],
    path: [],
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    detailTable: {
      title: "orden de coloreo",
      columns: ["posición", "nodo", "grado"],
      rows: orderedNodes.map((nodeId, index) => [
        index + 1,
        nodeId,
        adjacency.get(nodeId)?.length ?? 0,
      ]),
    },
  });

  orderedNodes.forEach((nodeId, index) => {
    Object.keys(nodeStates).forEach((currentId) => {
      if (nodeStates[currentId] === "current") {
        nodeStates[currentId] = "visited";
      }
    });

    nodeStates[nodeId] = "current";
    const neighborColors = new Set(
      (adjacency.get(nodeId) ?? [])
        .map((neighbor) => assignments.get(neighbor))
        .filter((value): value is number => typeof value === "number"),
    );

    let colorIndex = 0;
    while (neighborColors.has(colorIndex)) {
      colorIndex += 1;
    }

    assignments.set(nodeId, colorIndex);
    nodeVisuals[nodeId] = getColorVisual(colorIndex);

    steps.push({
      stepNumber: steps.length + 1,
      actionLabel: `coloreando · ${nodeId}`,
      description: `Se evalúan los vecinos de ${nodeId} y se asigna el color C${colorIndex + 1}.`,
      currentNode: nodeId,
      visited: orderedNodes.slice(0, index + 1),
      frontier: orderedNodes.slice(index + 1),
      exploredEdges: [],
      path: [],
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      nodeVisuals: { ...nodeVisuals },
      detailTable: buildColorDetailTable(assignments, adjacency),
    });

    nodeStates[nodeId] = "visited";
  });

  steps.push({
    stepNumber: steps.length + 1,
    actionLabel: "coloreo completado",
    description: `Se usaron ${new Set(assignments.values()).size} colores para cubrir el grafo sin conflictos adyacentes.`,
    currentNode: null,
    visited: [...orderedNodes],
    frontier: [],
    exploredEdges: [],
    path: [],
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    nodeVisuals: { ...nodeVisuals },
    detailTable: buildColorDetailTable(assignments, adjacency),
  });

  return steps;
}
