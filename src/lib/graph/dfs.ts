import type { AlgorithmStep, GraphData } from "./types";
import {
  createEdgeStateMap,
  createEmptyAlgorithmResult,
  createNodeStateMap,
  createPathEdgeIds,
  findNeighbors,
  reconstructPath,
} from "./traversal";

export function runDfs(graph: GraphData, startId: string, goalId?: string) {
  if (!startId || !graph.nodes.some((node) => node.id === startId)) {
    return createEmptyAlgorithmResult();
  }

  const nodeStates = createNodeStateMap(graph);
  const edgeStates = createEdgeStateMap(graph);
  const stack: string[] = [startId];
  const visited = new Set<string>();
  const discovered = new Set<string>([startId]);
  const parentMap: Record<string, string | null> = { [startId]: null };
  const steps: AlgorithmStep[] = [];
  const visitedOrder: string[] = [];

  nodeStates[startId] = "frontier";

  steps.push({
    stepNumber: 1,
    actionLabel: "inicio · dfs",
    description: `Inicializando DFS desde ${startId}. Pila inicial: [${startId}]`,
    currentNode: null,
    visited: [],
    frontier: [...stack],
    exploredEdges: [],
    path: [],
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
  });

  let exploredEdgeIds: string[] = [];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current || visited.has(current)) {
      continue;
    }

    Object.keys(nodeStates).forEach((nodeId) => {
      if (nodeStates[nodeId] === "current") {
        nodeStates[nodeId] = "visited";
      }
    });

    visited.add(current);
    visitedOrder.push(current);
    nodeStates[current] = "current";

    steps.push({
      stepNumber: steps.length + 1,
      actionLabel: `procesando · ${current}`,
      description: `Se desapila ${current} y se profundiza sobre sus vecinos.`,
      currentNode: current,
      visited: [...visitedOrder],
      frontier: [...stack],
      exploredEdges: [...exploredEdgeIds],
      path: [],
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
    });

    if (goalId && current === goalId) {
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
        description: `Camino encontrado por DFS: ${path.join(" → ")}`,
        currentNode: current,
        visited: [...visitedOrder],
        frontier: [...stack],
        exploredEdges: [...exploredEdgeIds, ...pathEdgeIds],
        path,
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
      });

      return steps;
    }

    const newFrontier: string[] = [];
    const neighbors = findNeighbors(graph, current);

    for (const { edgeId, neighbor } of [...neighbors].reverse()) {
      edgeStates[edgeId] = "explored";
      exploredEdgeIds = Array.from(new Set([...exploredEdgeIds, edgeId]));

      if (visited.has(neighbor) || discovered.has(neighbor)) {
        continue;
      }

      discovered.add(neighbor);
      parentMap[neighbor] = current;
      stack.push(neighbor);
      newFrontier.push(neighbor);

      if (nodeStates[neighbor] === "unvisited") {
        nodeStates[neighbor] = "frontier";
      }
    }

    nodeStates[current] = "visited";

    steps.push({
      stepNumber: steps.length + 1,
      actionLabel: `frontera actualizada · ${current}`,
      description:
        newFrontier.length > 0
          ? `Se apilan para explorar: ${newFrontier.join(", ")}`
          : `No hay nuevos vecinos por profundizar desde ${current}.`,
      currentNode: current,
      visited: [...visitedOrder],
      frontier: [...stack],
      exploredEdges: [...exploredEdgeIds],
      path: [],
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    actionLabel: "búsqueda finalizada",
    description: goalId
      ? `No existe un camino desde ${startId} hasta ${goalId} con DFS.`
      : `DFS completado desde ${startId}.`,
    currentNode: null,
    visited: [...visitedOrder],
    frontier: [],
    exploredEdges: [...exploredEdgeIds],
    path: [],
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
  });

  return steps;
}
