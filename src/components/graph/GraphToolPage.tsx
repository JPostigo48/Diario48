"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AlgorithmPanel from "./AlgorithmPanel";
import GraphCanvas from "./GraphCanvas";
import GraphEditorPanel from "./GraphEditorPanel";
import StepControls from "./StepControls";
import { algorithmOptions, runAlgorithm } from "@/lib/graph/algorithmSteps";
import { sampleGraph } from "@/lib/graph/sampleGraph";
import type { AlgorithmType, GraphData } from "@/lib/graph/types";
import {
  cloneGraph,
  createEdge,
  createNode,
  createNodeId,
  updateNodePosition,
} from "@/lib/graph/utils";

const EMPTY_GRAPH_NAME = "Nuevo grafo";

export default function GraphToolPage() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("bfs");
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [graphName, setGraphName] = useState(EMPTY_GRAPH_NAME);
  const [graphDescription, setGraphDescription] = useState("");
  const [startNode, setStartNode] = useState("");
  const [goalNode, setGoalNode] = useState("");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [savedGraphs, setSavedGraphs] = useState<GraphData[]>([]);
  const [loadingSavedGraphs, setLoadingSavedGraphs] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [loadMessage, setLoadMessage] = useState("");

  const [nodeId, setNodeId] = useState("");
  const [nodeLabel, setNodeLabel] = useState("");
  const [nodeHeuristic, setNodeHeuristic] = useState("");
  const [edgeSource, setEdgeSource] = useState("");
  const [edgeTarget, setEdgeTarget] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("");

  const autoPlayRef = useRef<number | null>(null);

  const syncGraphMetadata = useCallback(
    (baseGraph: GraphData): GraphData => ({
      ...baseGraph,
      name: graphName || baseGraph.name || EMPTY_GRAPH_NAME,
      description: graphDescription,
      startNode,
      goalNode,
    }),
    [goalNode, graphDescription, graphName, startNode],
  );

  const steps = useMemo(() => {
    if (!graph) {
      return [];
    }

    return runAlgorithm(
      algorithm,
      {
        ...graph,
        name: graphName,
        description: graphDescription,
        startNode,
        goalNode,
      },
      startNode,
      goalNode,
    );
  }, [algorithm, goalNode, graph, graphDescription, graphName, startNode]);

  const effectiveStepIndex =
    steps.length === 0 ? 0 : Math.min(currentStepIndex, steps.length - 1);
  const currentStep = steps[effectiveStepIndex] ?? null;

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      window.clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    setIsAutoPlaying(false);
  }, []);

  const loadExample = useCallback(() => {
    const nextGraph = cloneGraph(sampleGraph);
    setGraph(nextGraph);
    setGraphName(nextGraph.name);
    setGraphDescription(nextGraph.description ?? "");
    setStartNode(nextGraph.startNode ?? nextGraph.nodes[0]?.id ?? "");
    setGoalNode(nextGraph.goalNode ?? nextGraph.nodes.at(-1)?.id ?? "");
    setCurrentStepIndex(0);
    setSaveMessage("");
    setLoadMessage("Grafo de ejemplo cargado.");
  }, []);

  const clearGraph = useCallback(() => {
    stopAutoPlay();
    setGraph(null);
    setGraphName(EMPTY_GRAPH_NAME);
    setGraphDescription("");
    setStartNode("");
    setGoalNode("");
    setCurrentStepIndex(0);
    setSaveMessage("");
    setLoadMessage("Grafo limpiado.");
  }, [stopAutoPlay]);

  const refreshSavedGraphs = useCallback(async () => {
    setLoadingSavedGraphs(true);
    setLoadMessage("");

    try {
      const response = await fetch("/api/graphs");
      const payload = (await response.json()) as {
        data?: GraphData[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo cargar la lista de grafos.");
      }

      setSavedGraphs(
        (payload.data ?? []).map((savedGraph) => ({
          ...savedGraph,
          id:
            savedGraph.id ??
            (savedGraph as GraphData & { _id?: string }).id ??
            (savedGraph as GraphData & { _id?: string })._id,
        })),
      );
    } catch (error) {
      setLoadMessage(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la lista de grafos.",
      );
    } finally {
      setLoadingSavedGraphs(false);
    }
  }, []);

  const loadSavedGraph = useCallback(async (graphId: string) => {
    setLoadMessage("Cargando grafo guardado…");

    try {
      const response = await fetch(`/api/graphs/${graphId}`);
      const payload = (await response.json()) as {
        data?: GraphData;
        error?: string;
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "No se pudo cargar el grafo.");
      }

      const nextGraph: GraphData = {
        ...payload.data,
        id:
          payload.data.id ??
          (payload.data as GraphData & { _id?: string })._id,
      };

      setGraph(nextGraph);
      setGraphName(nextGraph.name);
      setGraphDescription(nextGraph.description ?? "");
      setStartNode(nextGraph.startNode ?? nextGraph.nodes[0]?.id ?? "");
      setGoalNode(nextGraph.goalNode ?? nextGraph.nodes.at(-1)?.id ?? "");
      setCurrentStepIndex(0);
      stopAutoPlay();
      setLoadMessage(`Grafo "${nextGraph.name}" cargado.`);
    } catch (error) {
      setLoadMessage(
        error instanceof Error ? error.message : "No se pudo cargar el grafo.",
      );
    }
  }, [stopAutoPlay]);

  const saveGraph = useCallback(async () => {
    if (!graph) {
      setSaveMessage("Primero crea o carga un grafo.");
      return;
    }

    const payload = syncGraphMetadata(graph);

    try {
      const requestInit: RequestInit = payload.id
        ? {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        : {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          };

      const response = await fetch(
        payload.id ? `/api/graphs/${payload.id}` : "/api/graphs",
        requestInit,
      );

      const result = (await response.json()) as {
        data?: GraphData;
        error?: string;
        details?: string[];
      };

      if (!response.ok || !result.data) {
        throw new Error(result.details?.join(" ") || result.error || "No se pudo guardar el grafo.");
      }

      const persistedGraph = {
        ...result.data,
        id: result.data.id ?? (result.data as GraphData & { _id?: string })._id,
      };

      setGraph(persistedGraph);
      setSaveMessage(`Grafo "${persistedGraph.name}" guardado correctamente.`);
      await refreshSavedGraphs();
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : "No se pudo guardar el grafo.",
      );
    }
  }, [graph, refreshSavedGraphs, syncGraphMetadata]);

  const addNode = useCallback(() => {
    const baseLabel = nodeLabel || nodeId || "N";

    setGraph((currentGraph) => {
      const safeGraph =
        currentGraph ??
        ({
          name: graphName || EMPTY_GRAPH_NAME,
          description: graphDescription,
          isPublic: true,
          nodes: [],
          edges: [],
          startNode,
          goalNode,
        } satisfies GraphData);

      const resolvedId = nodeId.trim()
        ? nodeId.trim().toUpperCase()
        : createNodeId(baseLabel, safeGraph.nodes.map((node) => node.id));

      if (safeGraph.nodes.some((node) => node.id === resolvedId)) {
        setSaveMessage(`El nodo "${resolvedId}" ya existe.`);
        return safeGraph;
      }

      const heuristicValue = nodeHeuristic.trim()
        ? Number(nodeHeuristic)
        : undefined;

      const nextNode = createNode(
        {
          id: resolvedId,
          label: nodeLabel.trim() || resolvedId,
          heuristic: Number.isFinite(heuristicValue) ? heuristicValue : undefined,
        },
        safeGraph.nodes.length,
      );

      const nextGraph: GraphData = {
        ...safeGraph,
        name: graphName || safeGraph.name || EMPTY_GRAPH_NAME,
        description: graphDescription,
        startNode: safeGraph.startNode || startNode || resolvedId,
        goalNode: safeGraph.goalNode || goalNode || resolvedId,
        nodes: [...safeGraph.nodes, nextNode],
      };

      if (!startNode) {
        setStartNode(resolvedId);
      }

      if (!goalNode) {
        setGoalNode(resolvedId);
      }

      setNodeId("");
      setNodeLabel("");
      setNodeHeuristic("");
      setCurrentStepIndex(0);
      setSaveMessage(`Nodo "${resolvedId}" agregado.`);

      return nextGraph;
    });
  }, [
    goalNode,
    graphDescription,
    graphName,
    nodeHeuristic,
    nodeId,
    nodeLabel,
    startNode,
  ]);

  const addEdge = useCallback(() => {
    if (!graph) {
      setSaveMessage("Primero agrega al menos un nodo.");
      return;
    }

    if (!edgeSource.trim() || !edgeTarget.trim()) {
      setSaveMessage("Debes indicar origen y destino de la arista.");
      return;
    }

    if (
      !graph.nodes.some((node) => node.id === edgeSource.trim()) ||
      !graph.nodes.some((node) => node.id === edgeTarget.trim())
    ) {
      setSaveMessage("La arista referencia nodos que no existen.");
      return;
    }

    const nextEdge = createEdge({
      source: edgeSource.trim().toUpperCase(),
      target: edgeTarget.trim().toUpperCase(),
      weight: edgeWeight.trim() ? Number(edgeWeight) : undefined,
    });

    if (graph.edges.some((edge) => edge.id === nextEdge.id)) {
      setSaveMessage(`La arista "${nextEdge.id}" ya existe.`);
      return;
    }

    setGraph({
      ...graph,
      name: graphName || graph.name,
      description: graphDescription,
      startNode,
      goalNode,
      edges: [...graph.edges, nextEdge],
    });
    setEdgeSource("");
    setEdgeTarget("");
    setEdgeWeight("");
    setCurrentStepIndex(0);
    setSaveMessage(`Arista "${nextEdge.id}" agregada.`);
  }, [
    edgeSource,
    edgeTarget,
    edgeWeight,
    goalNode,
    graph,
    graphDescription,
    graphName,
    startNode,
  ]);

  const handleNodePositionChange = useCallback(
    (nodeIdValue: string, x: number, y: number) => {
      setGraph((currentGraph) => {
        if (!currentGraph) {
          return currentGraph;
        }
        return updateNodePosition(currentGraph, nodeIdValue, x, y);
      });
    },
    [],
  );

  const handleRun = useCallback(() => {
    if (!graph) {
      loadExample();
      return;
    }

      setCurrentStepIndex((currentIndex) =>
        currentIndex < steps.length - 1 ? currentIndex + 1 : currentIndex,
      );
  }, [graph, loadExample, steps.length]);

  const handleNext = useCallback(() => {
    setCurrentStepIndex((currentIndex) =>
      currentIndex < steps.length - 1 ? currentIndex + 1 : currentIndex,
    );
  }, [steps.length]);

  const handlePrevious = useCallback(() => {
    stopAutoPlay();
    setCurrentStepIndex((currentIndex) => (currentIndex > 0 ? currentIndex - 1 : 0));
  }, [stopAutoPlay]);

  const handleReset = useCallback(() => {
    stopAutoPlay();
    setCurrentStepIndex(0);
  }, [stopAutoPlay]);

  const toggleAutoPlay = useCallback(() => {
    if (!steps.length) {
      return;
    }

    if (autoPlayRef.current) {
      stopAutoPlay();
      return;
    }

    setIsAutoPlaying(true);
    autoPlayRef.current = window.setInterval(() => {
      setCurrentStepIndex((currentIndex) => {
        if (currentIndex >= steps.length - 1) {
          stopAutoPlay();
          return currentIndex;
        }
        return currentIndex + 1;
      });
    }, 900);
  }, [steps.length, stopAutoPlay]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshSavedGraphs();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshSavedGraphs]);

  useEffect(() => () => stopAutoPlay(), [stopAutoPlay]);

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden rounded-[12px] border border-[#1a1d28] bg-[#090a0d] text-[#dde1ea]">
      <header className="flex items-center justify-between gap-3 border-b border-[#1a1d28] bg-[#0a0b0e] px-5 py-2.5">
        <div className="flex items-center gap-3">
          <div className="font-mono text-[11px] text-[#374151]">
            diario48 / <span className="text-[#4f8ef7]">visualizador de grafos</span>
          </div>

          <div className="flex gap-1">
            {algorithmOptions.map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => option.available && setAlgorithm(option.type)}
                disabled={!option.available}
                className={`rounded-[4px] border px-2.5 py-1 font-mono text-[10px] tracking-[0.3px] transition-all ${
                  option.type === algorithm
                    ? "border-[#4f8ef755] bg-[#4f8ef718] text-[#4f8ef7]"
                    : option.available
                      ? "border-[#1a1d28] text-[#4b5563] hover:border-[#2a3040] hover:text-[#9ca3af]"
                      : "cursor-not-allowed border-[#1a1d28] text-[#4b5563] opacity-35"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadExample}
            className="rounded-[4px] border border-[#1a1d28] bg-transparent px-3 py-1.5 font-mono text-[10px] text-[#6b7280] transition-all hover:border-[#2a3040] hover:text-[#9ca3af]"
          >
            cargar ejemplo
          </button>
          <button
            type="button"
            onClick={clearGraph}
            className="rounded-[4px] border border-[#1a1d28] bg-transparent px-3 py-1.5 font-mono text-[10px] text-[#6b7280] transition-all hover:border-[#ef444455] hover:text-[#ef4444]"
          >
            limpiar
          </button>
        </div>
      </header>

      <section className="grid flex-1 grid-cols-[240px_1fr_230px] overflow-hidden">
        <GraphEditorPanel
          graph={graph}
          graphName={graphName}
          graphDescription={graphDescription}
          nodeId={nodeId}
          nodeLabel={nodeLabel}
          nodeHeuristic={nodeHeuristic}
          edgeSource={edgeSource}
          edgeTarget={edgeTarget}
          edgeWeight={edgeWeight}
          startNode={startNode}
          goalNode={goalNode}
          savedGraphs={savedGraphs}
          loadingSavedGraphs={loadingSavedGraphs}
          saveMessage={saveMessage}
          loadMessage={loadMessage}
          onGraphNameChange={setGraphName}
          onGraphDescriptionChange={setGraphDescription}
          onNodeIdChange={setNodeId}
          onNodeLabelChange={setNodeLabel}
          onNodeHeuristicChange={setNodeHeuristic}
          onEdgeSourceChange={setEdgeSource}
          onEdgeTargetChange={setEdgeTarget}
          onEdgeWeightChange={setEdgeWeight}
          onStartNodeChange={setStartNode}
          onGoalNodeChange={setGoalNode}
          onAddNode={addNode}
          onAddEdge={addEdge}
          onLoadExample={loadExample}
          onClearGraph={clearGraph}
          onSaveGraph={saveGraph}
          onRefreshSavedGraphs={refreshSavedGraphs}
          onLoadSavedGraph={loadSavedGraph}
        />

        <div className="flex min-w-0 flex-col overflow-hidden border-x border-[#1a1d28]">
          <GraphCanvas
            graph={
              graph
                ? {
                    ...graph,
                    name: graphName,
                    description: graphDescription,
                    startNode,
                    goalNode,
                  }
                : null
            }
            step={currentStep}
            onNodePositionChange={handleNodePositionChange}
          />
          <StepControls
            currentStepIndex={effectiveStepIndex}
            totalSteps={steps.length}
            canRun={steps.length > 0}
            isAutoPlaying={isAutoPlaying}
            onRun={handleRun}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onReset={handleReset}
            onToggleAutoPlay={toggleAutoPlay}
          />
        </div>

        <AlgorithmPanel algorithm={algorithm} step={currentStep} />
      </section>
    </main>
  );
}
