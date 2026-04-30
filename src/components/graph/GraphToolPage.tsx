"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import AlgorithmPanel from "./AlgorithmPanel";
import ElementActionMenu from "./ElementActionMenu";
import ElementEditorModal from "./ElementEditorModal";
import GraphCanvas from "./GraphCanvas";
import GraphEditorPanel from "./GraphEditorPanel";
import GraphTimeline from "./GraphTimeline";
import StepControls from "./StepControls";
import { algorithmOptions, runAlgorithm } from "@/lib/graph/algorithmSteps";
import { sampleGraph } from "@/lib/graph/sampleGraph";
import { graphThemes, type GraphThemeMode } from "@/lib/graph/theme";
import type {
  AlgorithmType,
  GraphData,
  GraphEdge,
  GraphNode,
  SelectedGraphElement,
} from "@/lib/graph/types";
import {
  cloneGraph,
  createEdge,
  createNode,
  createNodeId,
  removeEdge,
  removeNode,
  updateEdgeDetails,
  updateNodeDetails,
  updateNodePosition,
} from "@/lib/graph/utils";

const EMPTY_GRAPH_NAME = "";

export default function GraphToolPage() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("bfs");
  const [themeMode, setThemeMode] = useState<GraphThemeMode>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const saved = window.localStorage.getItem("d48-theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode((current) => {
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem("d48-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);
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
  const [loadedGraphId, setLoadedGraphId] = useState<string | null>(null);
  const [isMetadataEditing, setIsMetadataEditing] = useState(true);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] =
    useState<SelectedGraphElement>(null);
  const [isElementModalOpen, setIsElementModalOpen] = useState(false);

  const [nodeId, setNodeId] = useState("");
  const [nodeLabel, setNodeLabel] = useState("");
  const [nodeHeuristic, setNodeHeuristic] = useState("");
  const [edgeSource, setEdgeSource] = useState("");
  const [edgeTarget, setEdgeTarget] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("");
  const [isDirected, setIsDirected] = useState(false);
  const [modalNodeLabel, setModalNodeLabel] = useState("");
  const [modalNodeHeuristic, setModalNodeHeuristic] = useState("");
  const [modalEdgeWeight, setModalEdgeWeight] = useState("");

  const autoPlayRef = useRef<number | null>(null);
  const theme = graphThemes[themeMode];

  const selectedNode: GraphNode | null =
    selectedElement?.type === "node"
      ? graph?.nodes.find((node) => node.id === selectedElement.id) ?? null
      : null;
  const selectedEdge: GraphEdge | null =
    selectedElement?.type === "edge"
      ? graph?.edges.find((edge) => edge.id === selectedElement.id) ?? null
      : null;

  const syncGraphMetadata = useCallback(
    (baseGraph: GraphData): GraphData => ({
      ...baseGraph,
      name: graphName.trim() || baseGraph.name || "Nuevo grafo",
      description: graphDescription,
      isDirected,
      startNode,
      goalNode,
    }),
    [goalNode, graphDescription, graphName, isDirected, startNode],
  );

  const steps = useMemo(() => {
    if (!graph) {
      return [];
    }

    return runAlgorithm(
      algorithm,
      {
        ...graph,
        name: graphName.trim() || graph.name,
        description: graphDescription,
        isDirected,
        startNode,
        goalNode,
      },
      startNode,
      goalNode,
    );
  }, [algorithm, goalNode, graph, graphDescription, graphName, isDirected, startNode]);

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

  const closeElementModal = useCallback(() => {
    setIsElementModalOpen(false);
  }, []);

  const openElementModal = useCallback(
    (element: SelectedGraphElement) => {
      if (!element || !graph) {
        return;
      }

      setSelectedElement(element);

      if (element.type === "node") {
        const node = graph.nodes.find((item) => item.id === element.id);
        if (!node) {
          return;
        }
        setModalNodeLabel(node.label);
        setModalNodeHeuristic(
          typeof node.heuristic === "number" ? String(node.heuristic) : "",
        );
      }

      if (element.type === "edge") {
        const edge = graph.edges.find((item) => item.id === element.id);
        if (!edge) {
          return;
        }
        setModalEdgeWeight(
          typeof edge.weight === "number" ? String(edge.weight) : "",
        );
      }

      setIsElementModalOpen(true);
    },
    [graph],
  );

  const loadExample = useCallback(() => {
    const nextGraph = cloneGraph(sampleGraph);
    setGraph(nextGraph);
    setGraphName(nextGraph.name);
    setGraphDescription(nextGraph.description ?? "");
    setIsDirected(nextGraph.isDirected ?? false);
    setStartNode(nextGraph.startNode ?? nextGraph.nodes[0]?.id ?? "");
    setGoalNode(nextGraph.goalNode ?? nextGraph.nodes.at(-1)?.id ?? "");
    setCurrentStepIndex(0);
    setLoadedGraphId(null);
    setIsMetadataEditing(true);
    setSaveMessage("");
    setLoadMessage("Grafo de ejemplo cargado.");
    setSelectedElement(null);
    closeElementModal();
  }, [closeElementModal]);

  const clearGraph = useCallback(() => {
    stopAutoPlay();
    setGraph(null);
    setGraphName("");
    setGraphDescription("");
    setIsDirected(false);
    setStartNode("");
    setGoalNode("");
    setCurrentStepIndex(0);
    setLoadedGraphId(null);
    setIsMetadataEditing(true);
    setSaveMessage("");
    setLoadMessage("");
    setIsLoadModalOpen(false);
    setSelectedElement(null);
    closeElementModal();
  }, [closeElementModal, stopAutoPlay]);

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

  const openLoadModal = useCallback(() => {
    setIsLoadModalOpen(true);
    void refreshSavedGraphs();
  }, [refreshSavedGraphs]);

  const closeLoadModal = useCallback(() => {
    setIsLoadModalOpen(false);
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
      setIsDirected(nextGraph.isDirected ?? false);
      setStartNode(nextGraph.startNode ?? nextGraph.nodes[0]?.id ?? "");
      setGoalNode(nextGraph.goalNode ?? nextGraph.nodes.at(-1)?.id ?? "");
      setCurrentStepIndex(0);
      setLoadedGraphId(nextGraph.id ?? null);
      setIsMetadataEditing(false);
      setIsLoadModalOpen(false);
      setSelectedElement(null);
      closeElementModal();
      stopAutoPlay();
      setLoadMessage(`Grafo "${nextGraph.name}" cargado.`);
      setSaveMessage("");
    } catch (error) {
      setLoadMessage(
        error instanceof Error ? error.message : "No se pudo cargar el grafo.",
      );
    }
  }, [closeElementModal, stopAutoPlay]);

  const saveNewGraph = useCallback(async () => {
    if (!graph) {
      setSaveMessage("Primero crea o carga un grafo.");
      return;
    }

    const payload = { ...syncGraphMetadata(graph) };
    delete payload.id;

    try {
      const response = await fetch("/api/graphs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        data?: GraphData;
        error?: string;
        details?: string[];
      };

      if (!response.ok || !result.data) {
        throw new Error(
          result.details?.join(" ") || result.error || "No se pudo guardar el grafo.",
        );
      }

      setLoadedGraphId(null);
      setIsMetadataEditing(true);
      setSaveMessage(`Se creó un nuevo grafo: "${result.data.name}".`);
      await refreshSavedGraphs();
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : "No se pudo guardar el grafo.",
      );
    }
  }, [graph, refreshSavedGraphs, syncGraphMetadata]);

  const updateGraph = useCallback(async () => {
    if (!graph || !loadedGraphId) {
      setSaveMessage("No hay un grafo cargado para actualizar.");
      return;
    }

    const payload = syncGraphMetadata(graph);

    try {
      const response = await fetch(`/api/graphs/${loadedGraphId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        data?: GraphData;
        error?: string;
        details?: string[];
      };

      if (!response.ok || !result.data) {
        throw new Error(
          result.details?.join(" ") || result.error || "No se pudo actualizar el grafo.",
        );
      }

      const persistedGraph = {
        ...result.data,
        id: result.data.id ?? (result.data as GraphData & { _id?: string })._id,
      };

      setGraph(persistedGraph);
      setGraphName(persistedGraph.name);
      setGraphDescription(persistedGraph.description ?? "");
      setLoadedGraphId(persistedGraph.id ?? loadedGraphId);
      setIsMetadataEditing(false);
      setSaveMessage(`Grafo "${persistedGraph.name}" actualizado.`);
      await refreshSavedGraphs();
    } catch (error) {
      setSaveMessage(
        error instanceof Error ? error.message : "No se pudo actualizar el grafo.",
      );
    }
  }, [graph, loadedGraphId, refreshSavedGraphs, syncGraphMetadata]);

  const addNode = useCallback(() => {
    const baseLabel = nodeLabel || nodeId || "N";

    setGraph((currentGraph) => {
      const safeGraph =
        currentGraph ??
        ({
          name: graphName.trim() || "Nuevo grafo",
          description: graphDescription,
          isPublic: true,
          isDirected,
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
        name: graphName.trim() || safeGraph.name || "Nuevo grafo",
        description: graphDescription,
        isDirected,
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
    isDirected,
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
      !graph.nodes.some((node) => node.id === edgeSource.trim().toUpperCase()) ||
      !graph.nodes.some((node) => node.id === edgeTarget.trim().toUpperCase())
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
      name: graphName.trim() || graph.name,
      description: graphDescription,
      isDirected,
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
    isDirected,
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

  const handleSaveElementChanges = useCallback(() => {
    if (!graph || !selectedElement) {
      return;
    }

    if (selectedElement.type === "node") {
      const heuristicValue = modalNodeHeuristic.trim();
      const nextGraph = updateNodeDetails(graph, selectedElement.id, {
        label: modalNodeLabel.trim() || selectedElement.id,
        heuristic:
          heuristicValue === ""
            ? undefined
            : Number.isFinite(Number(heuristicValue))
              ? Number(heuristicValue)
              : undefined,
      });
      setGraph(nextGraph);
      setSaveMessage(`Nodo "${selectedElement.id}" actualizado.`);
    }

    if (selectedElement.type === "edge") {
      const weightValue = modalEdgeWeight.trim();
      const nextGraph = updateEdgeDetails(graph, selectedElement.id, {
        weight:
          weightValue === ""
            ? undefined
            : Number.isFinite(Number(weightValue))
              ? Number(weightValue)
              : undefined,
      });
      setGraph(nextGraph);
      setSaveMessage(`Arista "${selectedElement.id}" actualizada.`);
    }

    closeElementModal();
  }, [
    closeElementModal,
    graph,
    modalEdgeWeight,
    modalNodeHeuristic,
    modalNodeLabel,
    selectedElement,
  ]);

  const handleDeleteElement = useCallback(() => {
    if (!graph || !selectedElement) {
      return;
    }

    if (selectedElement.type === "node") {
      const nextGraph = removeNode(graph, selectedElement.id);
      setGraph(nextGraph);
      if (startNode === selectedElement.id) {
        setStartNode("");
      }
      if (goalNode === selectedElement.id) {
        setGoalNode("");
      }
      setSaveMessage(
        `Nodo "${selectedElement.id}" eliminado junto con sus aristas conectadas.`,
      );
    }

    if (selectedElement.type === "edge") {
      const nextGraph = removeEdge(graph, selectedElement.id);
      setGraph(nextGraph);
      setSaveMessage(`Arista "${selectedElement.id}" eliminada.`);
    }

    setSelectedElement(null);
    closeElementModal();
    setCurrentStepIndex(0);
  }, [closeElementModal, goalNode, graph, selectedElement, startNode]);

  useEffect(() => {
    const shouldIgnoreKeyboardShortcut = (eventTarget: EventTarget | null) => {
      if (!(eventTarget instanceof HTMLElement)) {
        return false;
      }

      const tagName = eventTarget.tagName;
      return (
        eventTarget.isContentEditable ||
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT"
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreKeyboardShortcut(event.target)) {
        return;
      }

      if (!selectedElement) {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        openElementModal(selectedElement);
        return;
      }

      if (event.key === "Delete") {
        event.preventDefault();
        handleDeleteElement();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDeleteElement, openElementModal, selectedElement]);

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

  const handleSelectStep = useCallback(
    (index: number) => {
      stopAutoPlay();
      setCurrentStepIndex(index);
    },
    [stopAutoPlay],
  );

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
    <main
      className="flex h-screen w-screen flex-col overflow-hidden rounded-[12px] border"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.appBgDeep,
        color: theme.appText,
      }}
    >
      <header
        className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b px-4 py-3"
        style={{ borderColor: theme.border, backgroundColor: theme.panelBg }}
      >
        <Link
          href="/"
          className="justify-self-start font-mono text-[17px] font-bold hover:opacity-75 transition-opacity"
          style={{ color: theme.strongText, textDecoration: "none" }}
        >
          Diario<span style={{ color: theme.accent }}>48</span>
          <span style={{ color: theme.faintText, margin: "0 8px", fontSize: "14px", fontWeight: 400 }}>/</span>
          <span style={{ color: theme.mutedText, fontSize: "13px", fontWeight: 400 }}>visualizador de grafos</span>
        </Link>

        <div
          className="flex items-stretch gap-1 rounded-[8px] border p-1 justify-self-center"
          style={{ borderColor: theme.border, backgroundColor: theme.panelSurface }}
        >
          {algorithmOptions.map((option) => {
            const isActive = option.type === algorithm;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => option.available && option.type && setAlgorithm(option.type)}
                disabled={!option.available}
                className={`flex min-h-[44px] min-w-[58px] flex-col items-center justify-center rounded-[6px] border px-3 py-1.5 font-mono transition-all ${
                  !option.available ? "cursor-not-allowed opacity-35" : ""
                }`}
                style={
                  isActive
                    ? {
                        borderColor: theme.accent,
                        backgroundColor: theme.accentSoft,
                        color: theme.strongText,
                      }
                    : {
                        borderColor: "transparent",
                        color: theme.mutedText,
                      }
                }
              >
                <span className="text-[11px] leading-[1.05]">{option.label}</span>
                {option.secondaryLabel ? (
                  <span
                    className="mt-[2px] text-[9px] leading-[1.05]"
                    style={{ color: isActive ? theme.secondaryText : theme.faintText }}
                  >
                    {option.secondaryLabel}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <button
            type="button"
            onClick={loadExample}
            className="rounded-[4px] border bg-transparent px-3 py-1.5 font-mono text-[10px] transition-all"
            style={{
              borderColor: theme.border,
              color: theme.secondaryText,
              backgroundColor: theme.panelSurface,
            }}
          >
            cargar ejemplo
          </button>
          <ThemeSwitcher theme={themeMode} onToggle={toggleTheme} />
        </div>
      </header>

      <section className="grid flex-1 grid-cols-[352px_1fr_320px] overflow-hidden">
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
          isDirected={isDirected}
          startNode={startNode}
          goalNode={goalNode}
          savedGraphs={savedGraphs}
          loadingSavedGraphs={loadingSavedGraphs}
          saveMessage={saveMessage}
          loadMessage={loadMessage}
          theme={theme}
          loadedGraphId={loadedGraphId}
          isMetadataEditing={isMetadataEditing}
          isLoadModalOpen={isLoadModalOpen}
          onGraphNameChange={setGraphName}
          onGraphDescriptionChange={setGraphDescription}
          onNodeIdChange={setNodeId}
          onNodeLabelChange={setNodeLabel}
          onNodeHeuristicChange={setNodeHeuristic}
          onEdgeSourceChange={setEdgeSource}
          onEdgeTargetChange={setEdgeTarget}
          onEdgeWeightChange={setEdgeWeight}
          onIsDirectedChange={setIsDirected}
          onStartNodeChange={setStartNode}
          onGoalNodeChange={setGoalNode}
          onAddNode={addNode}
          onAddEdge={addEdge}
          onClearGraph={clearGraph}
          onSaveNewGraph={saveNewGraph}
          onUpdateGraph={updateGraph}
          onRefreshSavedGraphs={refreshSavedGraphs}
          onLoadSavedGraph={loadSavedGraph}
          onOpenLoadModal={openLoadModal}
          onCloseLoadModal={closeLoadModal}
          onEnableMetadataEditing={() => setIsMetadataEditing(true)}
        />

        <div className="flex min-w-0 flex-col overflow-hidden border-x" style={{ borderColor: theme.border }}>
          <GraphTimeline
            algorithm={algorithm}
            steps={steps}
            currentStepIndex={effectiveStepIndex}
            theme={theme}
            onSelectStep={handleSelectStep}
          />
          <div className="relative flex-1 overflow-hidden">
            <GraphCanvas
              graph={
                graph
                  ? {
                      ...graph,
                      name: graphName.trim() || graph.name,
                      description: graphDescription,
                      isDirected,
                      startNode,
                      goalNode,
                    }
                  : null
              }
              step={currentStep}
              themeMode={themeMode}
              canvasBackground={theme.canvasBg}
              gridColor={theme.gridColor}
              gridColorStrong={theme.gridColorStrong}
              dimText={theme.dimText}
              borderColor={theme.border}
              startColor={theme.start}
              goalColor={theme.goal}
              currentColor={theme.danger}
              frontierColor={theme.warning}
              visitedColor={theme.accent}
              selectedElement={selectedElement}
              onNodePositionChange={handleNodePositionChange}
              onSelectElement={setSelectedElement}
            />
            <ElementActionMenu
              theme={theme}
              selectedElement={selectedElement}
              selectedNode={selectedNode}
              selectedEdge={selectedEdge}
              onEdit={() => openElementModal(selectedElement)}
              onDelete={handleDeleteElement}
            />
          </div>
          <StepControls
            currentStepIndex={effectiveStepIndex}
            totalSteps={steps.length}
            canRun={steps.length > 0}
            isAutoPlaying={isAutoPlaying}
            theme={theme}
            onRun={handleRun}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onReset={handleReset}
            onSelectStep={handleSelectStep}
            onToggleAutoPlay={toggleAutoPlay}
          />
        </div>

        <AlgorithmPanel algorithm={algorithm} step={currentStep} theme={theme} />
      </section>

      {isElementModalOpen ? (
        <ElementEditorModal
          theme={theme}
          selectedElement={selectedElement}
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          nodeLabel={modalNodeLabel}
          nodeHeuristic={modalNodeHeuristic}
          edgeWeight={modalEdgeWeight}
          onNodeLabelChange={setModalNodeLabel}
          onNodeHeuristicChange={setModalNodeHeuristic}
          onEdgeWeightChange={setModalEdgeWeight}
          onClose={closeElementModal}
          onSave={handleSaveElementChanges}
          onDelete={handleDeleteElement}
        />
      ) : null}
    </main>
  );
}
