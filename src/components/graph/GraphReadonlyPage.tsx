"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useThemeMode } from "@/components/ui/useThemeMode";
import GraphCanvas from "./GraphCanvas";
import { graphThemes } from "@/lib/graph/theme";
import type { GraphData, SelectedGraphElement } from "@/lib/graph/types";

type GraphReadonlyPageProps = {
  graph: GraphData;
};

export default function GraphReadonlyPage({ graph }: GraphReadonlyPageProps) {
  const { theme: themeMode, toggleTheme } = useThemeMode();
  const theme = graphThemes[themeMode];
  const [selectedElement, setSelectedElement] = useState<SelectedGraphElement>(null);

  const selectedSummary = useMemo(() => {
    if (!selectedElement) {
      return null;
    }

    if (selectedElement.type === "node") {
      return graph.nodes.find((node) => node.id === selectedElement.id) ?? null;
    }

    return graph.edges.find((edge) => edge.id === selectedElement.id) ?? null;
  }, [graph.edges, graph.nodes, selectedElement]);

  return (
    <main
      className="flex h-screen w-screen flex-col overflow-hidden border"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.appBgDeep,
        color: theme.appText,
      }}
    >
      <header
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: theme.border, backgroundColor: theme.panelBg }}
      >
        <div>
          <Link
            href="/"
            className="font-mono text-[17px] font-bold no-underline"
            style={{ color: theme.strongText }}
          >
            Diario<span style={{ color: theme.accent }}>48</span>
          </Link>
          <div className="mt-1 font-mono text-[11px]" style={{ color: theme.mutedText }}>
            viewer readonly · enlace compartido
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="rounded-[6px] border px-2 py-1 font-mono text-[10px]"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.panelSurface,
              color: theme.secondaryText,
            }}
          >
            {graph.visibility === "link-readonly" ? "link-readonly" : "private"}
          </span>
          <ThemeSwitcher theme={themeMode} onToggle={toggleTheme} />
        </div>
      </header>

      <section className="grid flex-1 grid-cols-[1fr_320px] overflow-hidden">
        <div className="min-h-0">
            <GraphCanvas
              graph={graph}
              step={null}
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
            onNodePositionChange={() => {}}
            onSelectElement={setSelectedElement}
          />
        </div>

        <aside
          className="d48-scrollbar overflow-y-auto border-l p-4"
          style={{ borderColor: theme.border, backgroundColor: theme.panelBg }}
        >
          <div
            className="rounded-[10px] border p-4"
            style={{ borderColor: theme.border, backgroundColor: theme.panelSurface }}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.04em]" style={{ color: theme.mutedText }}>
              {"// grafo compartido"}
            </div>
            <h1 className="mt-2 font-mono text-[18px] font-semibold" style={{ color: theme.strongText }}>
              {graph.name}
            </h1>
            <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: theme.secondaryText }}>
              {graph.description || "Sin descripción."}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Metric label="nodos" value={String(graph.nodes.length)} theme={theme} />
              <Metric label="aristas" value={String(graph.edges.length)} theme={theme} />
              <Metric label="inicio" value={graph.startNode || "—"} theme={theme} />
              <Metric label="objetivo" value={graph.goalNode || "—"} theme={theme} />
            </div>
          </div>

          <div
            className="mt-4 rounded-[10px] border p-4"
            style={{ borderColor: theme.border, backgroundColor: theme.panelSurface }}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.04em]" style={{ color: theme.mutedText }}>
              {"// modo de acceso"}
            </div>
            <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: theme.secondaryText }}>
              Estás viendo este recurso en modo solo lectura. Si eres el dueño y
              entras con tu sesión, esta misma URL se abre en modo edición.
            </p>
          </div>

          <div
            className="mt-4 rounded-[10px] border p-4"
            style={{ borderColor: theme.border, backgroundColor: theme.panelSurface }}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.04em]" style={{ color: theme.mutedText }}>
              {"// selección"}
            </div>
            <div className="mt-2 text-[13px]" style={{ color: theme.secondaryText }}>
              {!selectedElement ? (
                "Selecciona un nodo o arista en el canvas para ver su detalle."
              ) : selectedElement.type === "node" && selectedSummary && "label" in selectedSummary ? (
                <>
                  <div className="font-mono text-[12px]" style={{ color: theme.strongText }}>
                    nodo {selectedSummary.id}
                  </div>
                  <div className="mt-1">Etiqueta: {selectedSummary.label}</div>
                  <div className="mt-1">h(n): {selectedSummary.heuristic ?? "—"}</div>
                </>
              ) : selectedSummary && "source" in selectedSummary ? (
                <>
                  <div className="font-mono text-[12px]" style={{ color: theme.strongText }}>
                    arista {selectedSummary.id}
                  </div>
                  <div className="mt-1">
                    {selectedSummary.source} → {selectedSummary.target}
                  </div>
                  <div className="mt-1">Peso: {selectedSummary.weight ?? "—"}</div>
                </>
              ) : (
                "Sin detalle disponible."
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: (typeof graphThemes)["dark"];
}) {
  return (
    <div
      className="rounded-[8px] border px-3 py-2"
      style={{ borderColor: theme.border, backgroundColor: theme.panelSurfaceAlt }}
    >
      <div className="font-mono text-[10px]" style={{ color: theme.mutedText }}>
        {label}
      </div>
      <div className="mt-1 font-mono text-[14px] font-semibold" style={{ color: theme.strongText }}>
        {value}
      </div>
    </div>
  );
}
