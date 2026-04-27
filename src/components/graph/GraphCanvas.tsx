"use client";

import { useEffect, useMemo, useRef } from "react";
import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import { buildCytoscapeStyles } from "@/lib/graph/cytoscapeStyles";
import type { AlgorithmStep, GraphData } from "@/lib/graph/types";

type GraphCanvasProps = {
  graph: GraphData | null;
  step: AlgorithmStep | null;
  onNodePositionChange: (nodeId: string, x: number, y: number) => void;
};

export default function GraphCanvas({
  graph,
  step,
  onNodePositionChange,
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
      classes: `node-${nodeStates[node.id] ?? "unvisited"}`,
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
      classes: `edge-${edgeStates[edge.id] ?? "normal"}`,
    }));

    return [...nodeElements, ...edgeElements];
  }, [graph, step]);

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
      style: buildCytoscapeStyles(graph),
      layout: {
        name: "preset",
        fit: true,
        padding: 40,
      },
      wheelSensitivity: 0.18,
      autoungrabify: false,
      boxSelectionEnabled: false,
    });

    cy.on("dragfree", "node", (event) => {
      const node = event.target;
      const position = node.position();
      onNodePositionChange(node.id(), position.x, position.y);
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
      if (cyRef.current === cy) {
        cyRef.current = null;
      }
    };
  }, [elements, graph, onNodePositionChange]);

  return (
    <div className="relative flex-1 overflow-hidden bg-[#090a0d]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#1a1d2820 1px, transparent 1px), linear-gradient(90deg, #1a1d2820 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {!graph ? (
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center">
            <div className="font-mono text-[11px] text-[#1e2333]">
              cytoscape.js — canvas listo para integrar
            </div>
            <div className="mt-1 font-mono text-[10px] text-[#2a3040]">
              carga un grafo de ejemplo para empezar
            </div>
          </div>
        </div>
      ) : null}

      <div ref={containerRef} className="relative z-10 h-full w-full" />
    </div>
  );
}
