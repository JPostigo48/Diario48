"use client";

import { useEffect, useMemo, useRef } from "react";
import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import { buildCytoscapeStyles } from "@/lib/graph/cytoscapeStyles";
import type { GraphThemeMode } from "@/lib/graph/theme";
import type {
  AlgorithmStep,
  GraphData,
  SelectedGraphElement,
} from "@/lib/graph/types";

type GraphCanvasProps = {
  graph: GraphData | null;
  step: AlgorithmStep | null;
  themeMode: GraphThemeMode;
  canvasBackground: string;
  gridColor: string;
  gridColorStrong: string;
  dimText: string;
  borderColor: string;
  startColor: string;
  goalColor: string;
  currentColor: string;
  frontierColor: string;
  visitedColor: string;
  selectedElement: SelectedGraphElement;
  onNodePositionChange: (nodeId: string, x: number, y: number) => void;
  onSelectElement: (element: SelectedGraphElement) => void;
};

export default function GraphCanvas({
  graph,
  step,
  themeMode,
  canvasBackground,
  gridColor,
  gridColorStrong,
  dimText,
  borderColor,
  startColor,
  goalColor,
  currentColor,
  frontierColor,
  visitedColor,
  selectedElement,
  onNodePositionChange,
  onSelectElement,
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<Core | null>(null);

  const elements = useMemo<ElementDefinition[]>(() => {
    if (!graph) {
      return [];
    }

    const nodeStates = step?.nodeStates ?? {};
    const edgeStates = step?.edgeStates ?? {};

    const nodeElements: ElementDefinition[] = graph.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
      },
      classes: `node-${nodeStates[node.id] ?? "unvisited"} ${
        selectedElement?.type === "node" && selectedElement.id === node.id
          ? "is-selected"
          : ""
      }`.trim(),
      position: { x: node.x, y: node.y },
    }));

    const edgeElements: ElementDefinition[] = graph.edges.map((edge) => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        weightLabel:
          typeof edge.weight === "number" ? String(edge.weight) : "",
      },
      classes: `edge-${edgeStates[edge.id] ?? "normal"} ${
        selectedElement?.type === "edge" && selectedElement.id === edge.id
          ? "is-selected"
          : ""
      }`.trim(),
    }));

    return [...nodeElements, ...edgeElements];
  }, [graph, selectedElement, step]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (!graph) {
      cyRef.current?.destroy();
      cyRef.current = null;
      return;
    }

    cyRef.current?.destroy();

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: buildCytoscapeStyles(graph, themeMode),
      layout: {
        name: "preset",
        fit: true,
        padding: 40,
      },
      autoungrabify: false,
      boxSelectionEnabled: false,
    });

    cy.on("dragfree", "node", (event) => {
      const node = event.target;
      const position = node.position();
      onNodePositionChange(node.id(), position.x, position.y);
    });

    cy.on("tap", "node, edge", (event) => {
      const element = event.target;
      const currentSelection = {
        type: element.isNode() ? "node" : "edge",
        id: element.id(),
      } as Exclude<SelectedGraphElement, null>;

      onSelectElement(currentSelection);
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        onSelectElement(null);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
      if (cyRef.current === cy) {
        cyRef.current = null;
      }
    };
  }, [
    elements,
    graph,
    onNodePositionChange,
    onSelectElement,
    themeMode,
  ]);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: canvasBackground }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px), linear-gradient(${gridColorStrong} 1px, transparent 1px), linear-gradient(90deg, ${gridColorStrong} 1px, transparent 1px)`,
          backgroundSize: "20px 20px, 20px 20px, 100px 100px, 100px 100px",
        }}
      />

      {!graph ? (
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center">
            <div className="font-mono text-[11px]" style={{ color: borderColor }}>
              cytoscape.js — canvas listo para integrar
            </div>
            <div className="mt-1 font-mono text-[10px]" style={{ color: dimText }}>
              carga un grafo de ejemplo para empezar
            </div>
          </div>
        </div>
      ) : null}

      <div ref={containerRef} className="relative z-10 h-full w-full" />

      {graph ? (
        <div
          className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-[10px] border px-3 py-2"
          style={{
            borderColor: borderColor,
            backgroundColor:
              themeMode === "dark"
                ? "rgba(20, 24, 34, 0.84)"
                : "rgba(255, 255, 255, 0.9)",
            color: dimText,
          }}
        >
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px]">
            <LegendDot color={startColor} ring label="inicio" />
            <LegendDot color={goalColor} ring label="objetivo" />
            <LegendDot color={currentColor} filled label="actual" />
            <LegendDot color={frontierColor} label="frontera" />
            <LegendDot color={visitedColor} label="visitado" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LegendDot({
  color,
  label,
  ring = false,
  filled = false,
}: {
  color: string;
  label: string;
  ring?: boolean;
  filled?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block rounded-full border"
        style={{
          width: 10,
          height: 10,
          borderColor: color,
          backgroundColor: filled ? color : "transparent",
          boxShadow: ring ? `0 0 0 2px ${color}55` : "none",
        }}
      />
      {label}
    </span>
  );
}
