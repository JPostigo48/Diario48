import type { AlgorithmCostRow, AlgorithmStep, GraphData } from "./types";
import {
  createEdgeStateMap,
  createEmptyAlgorithmResult,
  createNodeStateMap,
  createPathEdgeIds,
  findWeightedNeighbors,
  reconstructPath,
} from "./traversal";

type FrontierEntry = {
  nodeId: string;
  cost: number;
  order: number;
};

function buildCostRows(
  bestCostMap: Map<string, number>,
  parentMap: Record<string, string | null>,
): AlgorithmCostRow[] {
  return Array.from(bestCostMap.entries())
    .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
    .map(([nodeId, g]) => ({
      nodeId,
      g,
      parent: parentMap[nodeId] ?? null,
    }));
}

function buildFrontierSnapshot(frontier: FrontierEntry[]) {
  return [...frontier]
    .sort((a, b) => a.cost - b.cost || a.order - b.order || a.nodeId.localeCompare(b.nodeId))
    .map((entry) => entry.nodeId);
}

export function runUniformCost(graph: GraphData, startId: string, goalId?: string) {
  if (!startId || !graph.nodes.some((node) => node.id === startId)) {
    return createEmptyAlgorithmResult();
  }

  const nodeStates = createNodeStateMap(graph);
  const edgeStates = createEdgeStateMap(graph);
  const frontier: FrontierEntry[] = [{ nodeId: startId, cost: 0, order: 0 }];
  const visited = new Set<string>();
  const bestCostMap = new Map<string, number>([[startId, 0]]);
  const parentMap: Record<string, string | null> = { [startId]: null };
  const steps: AlgorithmStep[] = [];
  const visitedOrder: string[] = [];

  nodeStates[startId] = "frontier";

  steps.push({
    stepNumber: 1,
    actionLabel: "inicio · costo uniforme",
    description: `Inicializando costo uniforme desde ${startId}. Frontera inicial: [${startId}:0]`,
    currentNode: null,
    visited: [],
    frontier: [startId],
    exploredEdges: [],
    path: [],
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    costRows: buildCostRows(bestCostMap, parentMap),
  });

  let exploredEdgeIds: string[] = [];
  let insertionOrder = 1;

  while (frontier.length > 0) {
    frontier.sort(
      (a, b) => a.cost - b.cost || a.order - b.order || a.nodeId.localeCompare(b.nodeId),
    );

    const currentEntry = frontier.shift();
    if (!currentEntry) {
      break;
    }

    const knownBest = bestCostMap.get(currentEntry.nodeId);
    if (knownBest === undefined || currentEntry.cost > knownBest) {
      continue;
    }

    if (visited.has(currentEntry.nodeId)) {
      continue;
    }

    Object.keys(nodeStates).forEach((nodeId) => {
      if (nodeStates[nodeId] === "current") {
        nodeStates[nodeId] = "visited";
      }
    });

    visited.add(currentEntry.nodeId);
    visitedOrder.push(currentEntry.nodeId);
    nodeStates[currentEntry.nodeId] = "current";

    steps.push({
      stepNumber: steps.length + 1,
      actionLabel: `procesando · ${currentEntry.nodeId}`,
      description: `Se extrae ${currentEntry.nodeId} con costo acumulado g(n)=${currentEntry.cost}.`,
      currentNode: currentEntry.nodeId,
      visited: [...visitedOrder],
      frontier: buildFrontierSnapshot(frontier),
      exploredEdges: [...exploredEdgeIds],
      path: [],
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      costRows: buildCostRows(bestCostMap, parentMap),
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
        description: `Camino óptimo encontrado con costo ${currentEntry.cost}: ${path.join(" → ")}`,
        currentNode: currentEntry.nodeId,
        visited: [...visitedOrder],
        frontier: buildFrontierSnapshot(frontier),
        exploredEdges: [...exploredEdgeIds, ...pathEdgeIds],
        path,
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        costRows: buildCostRows(bestCostMap, parentMap),
      });

      return steps;
    }

    const discoveredUpdates: string[] = [];
    const neighbors = findWeightedNeighbors(graph, currentEntry.nodeId);

    for (const { edgeId, neighbor, weight } of neighbors) {
      edgeStates[edgeId] = "explored";
      exploredEdgeIds = Array.from(new Set([...exploredEdgeIds, edgeId]));

      if (visited.has(neighbor)) {
        continue;
      }

      const nextCost = currentEntry.cost + weight;
      const previousCost = bestCostMap.get(neighbor);

      if (previousCost !== undefined && nextCost >= previousCost) {
        continue;
      }

      bestCostMap.set(neighbor, nextCost);
      parentMap[neighbor] = currentEntry.nodeId;
      frontier.push({
        nodeId: neighbor,
        cost: nextCost,
        order: insertionOrder,
      });
      insertionOrder += 1;
      discoveredUpdates.push(`${neighbor}:${nextCost}`);

      if (nodeStates[neighbor] === "unvisited") {
        nodeStates[neighbor] = "frontier";
      }
    }

    nodeStates[currentEntry.nodeId] = "visited";

    steps.push({
      stepNumber: steps.length + 1,
      actionLabel: `frontera actualizada · ${currentEntry.nodeId}`,
      description:
        discoveredUpdates.length > 0
          ? `Se actualiza la frontera con ${discoveredUpdates.join(", ")}.`
          : `No hubo mejoras de costo desde ${currentEntry.nodeId}.`,
      currentNode: currentEntry.nodeId,
      visited: [...visitedOrder],
      frontier: buildFrontierSnapshot(frontier),
      exploredEdges: [...exploredEdgeIds],
      path: [],
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      costRows: buildCostRows(bestCostMap, parentMap),
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    actionLabel: "búsqueda finalizada",
    description: goalId
      ? `No existe un camino desde ${startId} hasta ${goalId} con costo uniforme.`
      : `Costo uniforme completado desde ${startId}.`,
    currentNode: null,
    visited: [...visitedOrder],
    frontier: [],
    exploredEdges: [...exploredEdgeIds],
    path: [],
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    costRows: buildCostRows(bestCostMap, parentMap),
  });

  return steps;
}
