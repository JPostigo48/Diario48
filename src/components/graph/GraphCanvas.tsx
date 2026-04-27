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
  dimText: string;
  borderColor: string;
  selectedElement: SelectedGraphElement;
  onNodePositionChange: (nodeId: string, x: number, y: number) => void;
  onSelectElement: (element: SelectedGraphElement) => void;
  onOpenElementModal: (element: SelectedGraphElement) => void;
};

export default function GraphCanvas({
  graph,
  step,
  themeMode,
  canvasBackground,
  gridColor,
  dimText,
  borderColor,
  selectedElement,
  onNodePositionChange,
  onSelectElement,
  onOpenElementModal,
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

    const containerElement = containerRef.current;
    const preventNativeContextMenu = (event: Event) => {
      event.preventDefault();
    };

    containerElement.addEventListener(
      "contextmenu",
      preventNativeContextMenu,
      true,
    );

    if (!graph) {
      cyRef.current?.destroy();
      cyRef.current = null;
      return () => {
        containerElement.removeEventListener(
          "contextmenu",
          preventNativeContextMenu,
          true,
        );
      };
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

    const contextTargets = [
      containerElement,
      ...(Array.from(
        containerElement.querySelectorAll("canvas"),
      ) as HTMLCanvasElement[]),
    ];

    contextTargets.forEach((targetElement) => {
      targetElement.addEventListener(
        "contextmenu",
        preventNativeContextMenu,
        true,
      );
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

    cy.on("cxttap", "node, edge", (event) => {
      event.originalEvent?.preventDefault?.();
      const element = event.target;
      const currentSelection = {
        type: element.isNode() ? "node" : "edge",
        id: element.id(),
      } as Exclude<SelectedGraphElement, null>;

      onSelectElement(currentSelection);
      onOpenElementModal(currentSelection);
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        onSelectElement(null);
      }
    });

    cyRef.current = cy;

    return () => {
      containerElement.removeEventListener(
        "contextmenu",
        preventNativeContextMenu,
        true,
      );
      contextTargets.forEach((targetElement) => {
        targetElement.removeEventListener(
          "contextmenu",
          preventNativeContextMenu,
          true,
        );
      });
      cy.destroy();
      if (cyRef.current === cy) {
        cyRef.current = null;
      }
    };
  }, [
    elements,
    graph,
    onNodePositionChange,
    onOpenElementModal,
    onSelectElement,
    themeMode,
  ]);

  return (
    <div
      className="relative flex-1 overflow-hidden"
      style={{ backgroundColor: canvasBackground }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
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
    </div>
  );
}
