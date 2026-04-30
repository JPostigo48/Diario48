import type { AlgorithmStep, GraphData } from "./types";
import {
  createEdgeStateMap,
  createEmptyAlgorithmResult,
  createNodeStateMap,
  createPathEdgeIds,
  reconstructPath,
} from "./traversal";
import {
  buildInformedCostRows,
  buildInformedFrontierSnapshot,
  getNodeHeuristic,
  relaxNeighbor,
  type InformedFrontierEntry,
} from "./informedSearch";

export function runGreedyBestFirst(
  graph: GraphData,
  startId: string,
  goalId?: string,
) {
  if (!startId || !graph.nodes.some((node) => node.id === startId)) {
    return createEmptyAlgorithmResult();
  }

  const nodeStates = createNodeStateMap(graph);
  const edgeStates = createEdgeStateMap(graph);
  const startH = getNodeHeuristic(graph, startId);
  const frontier: InformedFrontierEntry[] = [
    { nodeId: startId, g: 0, h: startH, f: startH, order: 0 },
  ];
  const visited = new Set<string>();
  const scoreMap = new Map<string, { g: number; h: number; f: number }>([
    [startId, { g: 0, h: startH, f: startH }],
  ]);
  const parentMap: Record<string, string | null> = { [startId]: null };
  const steps: AlgorithmStep[] = [];
  const visitedOrder: string[] = [];
  let exploredEdgeIds: string[] = [];
  const orderRef = { current: 1 };

  nodeStates[startId] = "frontier";

  steps.push({
    stepNumber: 1,
    actionLabel: "inicio · primer mejor",
    description: `Inicializando Primer Mejor desde ${startId}. Frontera inicial priorizada por h(n).`,
    currentNode: null,
    visited: [],
    frontier: [startId],
    exploredEdges: [],
    path: [],
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    costRows: buildInformedCostRows(scoreMap, parentMap),
  });

  while (frontier.length > 0) {
    frontier.sort(
      (a, b) => a.f - b.f || a.h - b.h || a.order - b.order || a.nodeId.localeCompare(b.nodeId),
    );

    const currentEntry = frontier.shift();
    if (!currentEntry || visited.has(currentEntry.nodeId)) {
      continue;
    }

    Object.keys(nodeStates).forEach((nodeId) => {
      if (nodeStates[nodeId] === "current") nodeStates[nodeId] = "visited";
    });

    visited.add(currentEntry.nodeId);
    visitedOrder.push(currentEntry.nodeId);
    nodeStates[currentEntry.nodeId] = "current";

    steps.push({
      stepNumber: steps.length + 1,
      actionLabel: `procesando · ${currentEntry.nodeId}`,
      description: `Se selecciona ${currentEntry.nodeId} por menor heurística h(n)=${currentEntry.h}.`,
      currentNode: currentEntry.nodeId,
      visited: [...visitedOrder],
      frontier: buildInformedFrontierSnapshot(frontier),
      exploredEdges: [...exploredEdgeIds],
      path: [],
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      costRows: buildInformedCostRows(scoreMap, parentMap),
    });

    if (goalId && currentEntry.nodeId === goalId) {
      const path = reconstructPath(parentMap, goalId);
      const pathEdgeIds = createPathEdgeIds(graph, path);

      path.forEach((nodeId) => {
        nodeStates[nodeId] = "path";
      });
      pathEdgeIds.forEach((edgeId) => {
        edgeStates[edgeId] = "path";
      });

      steps.push({
        stepNumber: steps.length + 1,
        actionLabel: `objetivo encontrado · ${goalId}`,
        description: `Camino encontrado por Primer Mejor: ${path.join(" → ")}`,
        currentNode: currentEntry.nodeId,
        visited: [...visitedOrder],
        frontier: buildInformedFrontierSnapshot(frontier),
        exploredEdges: [...exploredEdgeIds, ...pathEdgeIds],
        path,
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        costRows: buildInformedCostRows(scoreMap, parentMap),
      });

      return steps;
    }

    const { updates, explored } = relaxNeighbor(
      graph,
      currentEntry.nodeId,
      currentEntry.g,
      frontier,
      scoreMap,
      parentMap,
      orderRef,
      "greedy",
    );

    for (const { edgeId, neighbor } of explored) {
      edgeStates[edgeId] = "explored";
      exploredEdgeIds = Array.from(new Set([...exploredEdgeIds, edgeId]));
      if (!visited.has(neighbor) && nodeStates[neighbor] === "unvisited") {
        nodeStates[neighbor] = "frontier";
      }
    }

    nodeStates[currentEntry.nodeId] = "visited";

    steps.push({
      stepNumber: steps.length + 1,
      actionLabel: `frontera actualizada · ${currentEntry.nodeId}`,
      description:
        updates.length > 0
          ? `Se priorizan nodos por heurística: ${updates.join(", ")}.`
          : `No hubo mejores candidatos heurísticos desde ${currentEntry.nodeId}.`,
      currentNode: currentEntry.nodeId,
      visited: [...visitedOrder],
      frontier: buildInformedFrontierSnapshot(frontier),
      exploredEdges: [...exploredEdgeIds],
      path: [],
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      costRows: buildInformedCostRows(scoreMap, parentMap),
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    actionLabel: "búsqueda finalizada",
    description: goalId
      ? `No existe un camino desde ${startId} hasta ${goalId} con Primer Mejor.`
      : `Primer Mejor completado desde ${startId}.`,
    currentNode: null,
    visited: [...visitedOrder],
    frontier: [],
    exploredEdges: [...exploredEdgeIds],
    path: [],
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    costRows: buildInformedCostRows(scoreMap, parentMap),
  });

  return steps;
}
