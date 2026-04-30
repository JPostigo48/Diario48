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

const EVAPORATION = 0.25;
const Q = 4;

type ColoringAssignment = Map<string, number>;

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

function pheromoneKey(nodeId: string, colorIndex: number) {
  return `${nodeId}::${colorIndex}`;
}

function buildNodeVisuals(assignments: ColoringAssignment) {
  return Object.fromEntries(
    Array.from(assignments.entries()).map(([nodeId, colorIndex]) => [
      nodeId,
      getColorVisual(colorIndex),
    ]),
  ) satisfies Record<string, AlgorithmNodeVisual>;
}

function buildColoringTable(
  assignments: ColoringAssignment,
  adjacency: Map<string, string[]>,
  pheromones: Map<string, number>,
) {
  return {
    title: "ant colony coloring",
    columns: ["nodo", "color", "τ nodo-color", "grado"],
    rows: Array.from(assignments.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([nodeId, colorIndex]) => [
        nodeId,
        `C${colorIndex + 1}`,
        (pheromones.get(pheromoneKey(nodeId, colorIndex)) ?? 1).toFixed(2),
        adjacency.get(nodeId)?.length ?? 0,
      ]),
  };
}

function chooseColorForNode(
  nodeId: string,
  assignments: ColoringAssignment,
  adjacency: Map<string, string[]>,
  pheromones: Map<string, number>,
) {
  const neighborColors = new Set(
    (adjacency.get(nodeId) ?? [])
      .map((neighbor) => assignments.get(neighbor))
      .filter((value): value is number => typeof value === "number"),
  );

  const maxUsedColor = Math.max(-1, ...Array.from(assignments.values()));
  const candidates = Array.from({ length: maxUsedColor + 2 }, (_, colorIndex) => colorIndex)
    .filter((colorIndex) => !neighborColors.has(colorIndex))
    .map((colorIndex) => {
      const pheromone = pheromones.get(pheromoneKey(nodeId, colorIndex)) ?? 1;
      const desirability = 1 / (colorIndex + 1);
      const score = pheromone * desirability;
      return { colorIndex, score, pheromone };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.pheromone - a.pheromone ||
        a.colorIndex - b.colorIndex,
    );

  return candidates[0]?.colorIndex ?? 0;
}

function constructColoring(
  orderedNodes: string[],
  adjacency: Map<string, string[]>,
  pheromones: Map<string, number>,
) {
  const assignments: ColoringAssignment = new Map();

  for (const nodeId of orderedNodes) {
    const colorIndex = chooseColorForNode(nodeId, assignments, adjacency, pheromones);
    assignments.set(nodeId, colorIndex);
  }

  const colorCount = new Set(assignments.values()).size;
  const pheromoneGain = Q / Math.max(1, colorCount);

  return { assignments, colorCount, pheromoneGain };
}

export function runAntColony(graph: GraphData): AlgorithmStep[] {
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
  const pheromones = new Map<string, number>();
  const iterations = Math.min(7, Math.max(4, graph.nodes.length));
  const antsPerIteration = Math.min(4, Math.max(2, Math.ceil(graph.nodes.length / 3)));
  const steps: AlgorithmStep[] = [];
  let bestAssignments: ColoringAssignment = new Map();
  let bestColorCount = Number.POSITIVE_INFINITY;
  let bestNodeVisuals: Record<string, AlgorithmNodeVisual> = {};

  for (const nodeId of orderedNodes) {
    for (let colorIndex = 0; colorIndex < graph.nodes.length; colorIndex += 1) {
      pheromones.set(pheromoneKey(nodeId, colorIndex), 1);
    }
  }

  steps.push({
    stepNumber: 1,
    actionLabel: "inicio · antcol coloring",
    description:
      "Se inicializan feromonas por par nodo-color. Cada hormiga construye una coloración completa y luego refuerza las asignaciones que usan menos colores.",
    currentNode: null,
    visited: [],
    frontier: [...orderedNodes],
    exploredEdges: [],
    path: [],
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    detailTable: {
      title: "orden de construcción",
      columns: ["posición", "nodo", "grado"],
      rows: orderedNodes.map((nodeId, index) => [
        index + 1,
        nodeId,
        adjacency.get(nodeId)?.length ?? 0,
      ]),
    },
  });

  for (let iteration = 1; iteration <= iterations; iteration += 1) {
    const depositMap = new Map<string, number>();

    for (let antIndex = 1; antIndex <= antsPerIteration; antIndex += 1) {
      const { assignments, colorCount, pheromoneGain } = constructColoring(
        orderedNodes,
        adjacency,
        pheromones,
      );

      for (const [nodeId, colorIndex] of assignments.entries()) {
        depositMap.set(
          pheromoneKey(nodeId, colorIndex),
          (depositMap.get(pheromoneKey(nodeId, colorIndex)) ?? 0) + pheromoneGain,
        );
      }

      const currentVisuals = buildNodeVisuals(assignments);

      if (
        colorCount < bestColorCount ||
        (colorCount === bestColorCount &&
          JSON.stringify(Array.from(assignments.entries())) <
            JSON.stringify(Array.from(bestAssignments.entries())))
      ) {
        bestAssignments = new Map(assignments);
        bestColorCount = colorCount;
        bestNodeVisuals = currentVisuals;
      }

      Object.keys(nodeStates).forEach((nodeId) => {
        nodeStates[nodeId] = assignments.has(nodeId) ? "visited" : "unvisited";
      });

      steps.push({
        stepNumber: steps.length + 1,
        actionLabel: `hormiga ${antIndex} · iteración ${iteration}`,
        description: `La hormiga ${antIndex} generó una coloración completa usando ${colorCount} colores.`,
        currentNode: orderedNodes.at(-1) ?? null,
        visited: [...orderedNodes],
        frontier: [],
        exploredEdges: [],
        path: [],
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        nodeVisuals: currentVisuals,
        detailTable: buildColoringTable(assignments, adjacency, pheromones),
      });
    }

    for (const [key, currentValue] of pheromones.entries()) {
      pheromones.set(key, currentValue * (1 - EVAPORATION) + (depositMap.get(key) ?? 0));
    }

    steps.push({
      stepNumber: steps.length + 1,
      actionLabel: `feromonas actualizadas · iteración ${iteration}`,
      description: `Se evaporan feromonas y se refuerzan las asignaciones nodo-color de las hormigas con menor número de colores. Mejor solución actual: ${bestColorCount} colores.`,
      currentNode: null,
      visited: [...orderedNodes],
      frontier: [],
      exploredEdges: [],
      path: [],
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      nodeVisuals: { ...bestNodeVisuals },
      detailTable: buildColoringTable(bestAssignments, adjacency, pheromones),
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    actionLabel: "coloración completada",
    description: `Ant Colony Coloring completó el grafo con ${bestColorCount} colores en su mejor solución encontrada.`,
    currentNode: null,
    visited: [...orderedNodes],
    frontier: [],
    exploredEdges: [],
    path: [],
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    nodeVisuals: { ...bestNodeVisuals },
    detailTable: buildColoringTable(bestAssignments, adjacency, pheromones),
  });

  return steps;
}
