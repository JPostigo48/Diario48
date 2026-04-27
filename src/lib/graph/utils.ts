import type { GraphData, GraphEdge, GraphNode } from "./types";

export function cloneGraph(graph: GraphData): GraphData {
  return {
    ...graph,
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: graph.edges.map((edge) => ({ ...edge })),
  };
}

export function createNodeId(label: string, existingIds: string[]) {
  const base = label.trim().toUpperCase().replace(/\s+/g, "-") || "N";
  if (!existingIds.includes(base)) {
    return base;
  }

  let counter = 1;
  while (existingIds.includes(`${base}-${counter}`)) {
    counter += 1;
  }

  return `${base}-${counter}`;
}

export function createNode(
  data: Pick<GraphNode, "id" | "label"> &
    Partial<Pick<GraphNode, "heuristic" | "x" | "y">>,
  index: number,
): GraphNode {
  return {
    id: data.id.trim(),
    label: data.label.trim() || data.id.trim(),
    heuristic: data.heuristic,
    x: data.x ?? 120 + (index % 4) * 110,
    y: data.y ?? 100 + Math.floor(index / 4) * 100,
  };
}

export function createEdge(
  edge: Pick<GraphEdge, "source" | "target"> & Partial<Pick<GraphEdge, "id" | "weight">>,
): GraphEdge {
  const id = edge.id?.trim() || `${edge.source.trim()}-${edge.target.trim()}`;
  return {
    id,
    source: edge.source.trim(),
    target: edge.target.trim(),
    weight: edge.weight,
  };
}

export function updateNodePosition(
  graph: GraphData,
  nodeId: string,
  x: number,
  y: number,
): GraphData {
  return {
    ...graph,
    nodes: graph.nodes.map((node) =>
      node.id === nodeId ? { ...node, x, y } : node,
    ),
  };
}

export function updateNodeDetails(
  graph: GraphData,
  nodeId: string,
  updates: Partial<Pick<GraphNode, "label" | "heuristic">>,
): GraphData {
  return {
    ...graph,
    nodes: graph.nodes.map((node) =>
      node.id === nodeId ? { ...node, ...updates } : node,
    ),
  };
}

export function updateEdgeDetails(
  graph: GraphData,
  edgeId: string,
  updates: Partial<Pick<GraphEdge, "weight">>,
): GraphData {
  return {
    ...graph,
    edges: graph.edges.map((edge) =>
      edge.id === edgeId ? { ...edge, ...updates } : edge,
    ),
  };
}

export function removeNode(graph: GraphData, nodeId: string): GraphData {
  return {
    ...graph,
    nodes: graph.nodes.filter((node) => node.id !== nodeId),
    edges: graph.edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId,
    ),
    startNode: graph.startNode === nodeId ? undefined : graph.startNode,
    goalNode: graph.goalNode === nodeId ? undefined : graph.goalNode,
  };
}

export function removeEdge(graph: GraphData, edgeId: string): GraphData {
  return {
    ...graph,
    edges: graph.edges.filter((edge) => edge.id !== edgeId),
  };
}

export function validateGraphInput(payload: unknown): {
  valid: boolean;
  errors: string[];
  data?: GraphData;
} {
  const errors: string[] = [];

  if (!payload || typeof payload !== "object") {
    return { valid: false, errors: ["El cuerpo del grafo es inválido."] };
  }

  const raw = payload as Partial<GraphData>;

  if (!raw.name?.trim()) {
    errors.push("`name` es obligatorio.");
  }

  const nodes = Array.isArray(raw.nodes) ? raw.nodes : [];
  const edges = Array.isArray(raw.edges) ? raw.edges : [];

  if (nodes.length === 0) {
    errors.push("El grafo debe tener al menos un nodo.");
  }

  const nodeIds = new Set<string>();
  for (const node of nodes) {
    if (!node?.id?.trim()) {
      errors.push("Todos los nodos deben tener `id`.");
      continue;
    }
    if (nodeIds.has(node.id)) {
      errors.push(`El nodo "${node.id}" está duplicado.`);
    }
    nodeIds.add(node.id);
  }

  for (const edge of edges) {
    if (!edge?.source?.trim() || !edge?.target?.trim()) {
      errors.push("Todas las aristas deben tener `source` y `target`.");
      continue;
    }
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      errors.push(
        `La arista "${edge.id ?? `${edge.source}-${edge.target}`}" referencia nodos inexistentes.`,
      );
    }
  }

  if (raw.startNode && !nodeIds.has(raw.startNode)) {
    errors.push("`startNode` debe existir dentro de `nodes`.");
  }

  if (raw.goalNode && !nodeIds.has(raw.goalNode)) {
    errors.push("`goalNode` debe existir dentro de `nodes`.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      id: raw.id,
      name: raw.name!.trim(),
      description: raw.description?.trim() || "",
      isPublic: raw.isPublic ?? true,
      startNode: raw.startNode,
      goalNode: raw.goalNode,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      nodes: nodes.map((node, index) => createNode(node, index)),
      edges: edges.map((edge) => createEdge(edge)),
    },
  };
}
