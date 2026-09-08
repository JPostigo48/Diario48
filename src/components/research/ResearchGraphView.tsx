"use client";

import { useEffect, useMemo, useRef } from "react";
import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import { buildResearchGraphData } from "@/features/papers-review/paper-graph/buildGraphData";
import type { PaperRelation, ResearchPaper } from "@/lib/research/types";

type ResearchGraphViewProps = {
  papers: ResearchPaper[];
  relations: PaperRelation[];
  selectedPaperId: string | null;
  onSelectPaper: (paperId: string | null) => void;
};

export default function ResearchGraphView({
  papers,
  relations,
  selectedPaperId,
  onSelectPaper,
}: ResearchGraphViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<Core | null>(null);

  const graphData = useMemo(
    () => buildResearchGraphData(papers, relations),
    [papers, relations],
  );

  const elements = useMemo<ElementDefinition[]>(() => {
    const nodes: ElementDefinition[] = graphData.visiblePapers.map((paper) => ({
      data: {
        id: paper.id,
        label: paper.title.length > 48 ? `${paper.title.slice(0, 45)}…` : paper.title,
      },
      classes: paper.id === selectedPaperId ? "is-selected" : "",
    }));

    const edges: ElementDefinition[] = graphData.edges.map((edge) => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      },
      classes: edge.inferred ? "is-inferred" : "is-explicit",
    }));

    return [...nodes, ...edges];
  }, [graphData.edges, graphData.visiblePapers, selectedPaperId]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    cyRef.current?.destroy();

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": "var(--acc2)",
            color: "var(--tx)",
            "border-color": "var(--br2)",
            "border-width": 1.5,
            "text-wrap": "wrap",
            "text-max-width": "110px",
            "font-size": 10,
            "text-valign": "center",
            "text-halign": "center",
            width: "56px",
            height: "56px",
            "overlay-opacity": 0,
          },
        },
        {
          selector: "node.is-selected",
          style: {
            "background-color": "var(--acc)",
            "border-color": "var(--tx)",
            "border-width": 4,
            color: "var(--bg)",
            width: "68px",
            height: "68px",
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "var(--br2)",
            "target-arrow-color": "var(--br2)",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            color: "var(--tx4)",
            "font-size": 8,
            "text-background-opacity": 1,
            "text-background-color": "var(--bg2)",
            "text-background-padding": "2px",
          },
        },
        {
          selector: "edge.is-inferred",
          style: {
            "line-style": "dashed",
            "target-arrow-shape": "none",
            "line-color": "var(--tx4)",
            color: "var(--tx4)",
          },
        },
      ],
      layout: {
        name: "cose",
        animate: false,
        fit: true,
        padding: 28,
      },
      boxSelectionEnabled: false,
    });

    cy.on("tap", "node", (event) => {
      onSelectPaper(event.target.id());
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        onSelectPaper(null);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
      if (cyRef.current === cy) {
        cyRef.current = null;
      }
    };
  }, [elements, onSelectPaper]);

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--br)] bg-[var(--bg2)] px-3 py-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[var(--tx4)]">{"// grafo"}</p>
          <p className="text-[11px] text-[var(--tx3)]">
            afinidades detectadas entre papers del workspace
          </p>
        </div>
        <div className="text-[10px] text-[var(--tx4)]">
          {graphData.visiblePapers.length} nodos · {graphData.edges.length} enlaces
        </div>
      </div>

      {graphData.visiblePapers.length ? (
        <div className="relative flex-1 overflow-hidden bg-[var(--bg)]">
          <div ref={containerRef} className="h-full w-full" />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center border border-dashed border-[var(--br2)] bg-[var(--bg3)] text-center text-[12px] text-[var(--tx3)]">
          Agrega papers al workspace para visualizar un grafo aquí.
        </div>
      )}
    </div>
  );
}
