import type {
  AlgorithmStep,
  EdgeVisualState,
  GraphData,
  NodeVisualState,
} from "./types";

function createNodeStateMap(graph: GraphData): Record<string, NodeVisualState> {
  return Object.fromEntries(graph.nodes.map((node) => [node.id, "unvisited"]));
}

function createEdgeStateMap(graph: GraphData): Record<string, EdgeVisualState> {
  return Object.fromEntries(graph.edges.map((edge) => [edge.id, "normal"]));
}

function findNeighbors(graph: GraphData, nodeId: string) {
  return graph.edges
    .filter((edge) => edge.source === nodeId || edge.target === nodeId)
    .map((edge) => ({
      edgeId: edge.id,
      neighbor: edge.source === nodeId ? edge.target : edge.source,
    }));
}

function reconstructPath(parentMap: Record<string, string | null>, goalId: string) {
  const path: string[] = [];
  let cursor: string | null = goalId;

  while (cursor) {
    path.unshift(cursor);
    cursor = parentMap[cursor] ?? null;
  }

  return path;
}

function createPathEdgeIds(graph: GraphData, path: string[]) {
  const edgeIds: string[] = [];

  for (let index = 0; index < path.length - 1; index += 1) {
    const current = path[index];
    const next = path[index + 1];
    const edge = graph.edges.find(
      (candidate) =>
        (candidate.source === current && candidate.target === next) ||
        (candidate.source === next && candidate.target === current),
    );

    if (edge) {
      edgeIds.push(edge.id);
    }
  }

  return edgeIds;
}

export function runBfs(graph: GraphData, startId: string, goalId?: string) {
  if (!startId || !graph.nodes.some((node) => node.id === startId)) {
    return [] satisfies AlgorithmStep[];
  }

  const nodeStates = createNodeStateMap(graph);
  const edgeStates = createEdgeStateMap(graph);
  const queue: string[] = [startId];
  const visited = new Set<string>();
  const discovered = new Set<string>([startId]);
  const parentMap: Record<string, string | null> = { [startId]: null };
  const steps: AlgorithmStep[] = [];
  const visitedOrder: string[] = [];

  nodeStates[startId] = "frontier";

  steps.push({
    stepNumber: 1,
    actionLabel: "inicio · bfs",
    description: `Inicializando BFS desde ${startId}. Cola inicial: [${startId}]`,
    currentNode: null,
    visited: [],
    frontier: [...queue],
    exploredEdges: [],
    path: [],
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
  });

  let exploredEdgeIds: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift();

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
      description: `Se desencola ${current} y se exploran sus vecinos.`,
      currentNode: current,
      visited: [...visitedOrder],
      frontier: [...queue],
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
        description: `Camino final: ${path.join(" → ")}`,
        currentNode: current,
        visited: [...visitedOrder],
        frontier: [...queue],
        exploredEdges: [...exploredEdgeIds, ...pathEdgeIds],
        path,
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
      });

      return steps;
    }

    const newFrontier: string[] = [];
    const neighbors = findNeighbors(graph, current);

    for (const { edgeId, neighbor } of neighbors) {
      edgeStates[edgeId] = "explored";
      exploredEdgeIds = Array.from(
        new Set([...exploredEdgeIds, edgeId]),
      );

      if (visited.has(neighbor) || discovered.has(neighbor)) {
        continue;
      }

      discovered.add(neighbor);
      parentMap[neighbor] = current;
      queue.push(neighbor);
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
          ? `Se agregan a la cola: ${newFrontier.join(", ")}`
          : `No hay nuevos vecinos por agregar desde ${current}.`,
      currentNode: current,
      visited: [...visitedOrder],
      frontier: [...queue],
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
      ? `No existe un camino desde ${startId} hasta ${goalId}.`
      : `BFS completado desde ${startId}.`,
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
