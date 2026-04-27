import type { GraphTheme } from "@/lib/graph/theme";
import type { GraphData } from "@/lib/graph/types";

type SavedGraphsPanelProps = {
  graphs: GraphData[];
  loading: boolean;
  message?: string;
  theme: GraphTheme;
  onRefresh: () => void;
  onLoad: (graphId: string) => void;
};

export default function SavedGraphsPanel({
  graphs,
  loading,
  message,
  theme,
  onRefresh,
  onLoad,
}: SavedGraphsPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="mb-2 font-mono text-[11px] uppercase tracking-[0.04em]"
        style={{ color: theme.mutedText }}
      >
        {"// grafos guardados"}
      </div>

      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-[6px] border px-3 py-2 font-mono text-[12px] transition-all"
          style={{
            borderColor: theme.border,
            color: theme.secondaryText,
            backgroundColor: theme.panelSurface,
          }}
        >
          recargar
        </button>
        {loading ? (
          <span className="font-mono text-[11px]" style={{ color: theme.accent }}>
            cargando…
          </span>
        ) : null}
      </div>

      {message ? (
        <div
          className="mb-3 rounded-[8px] border px-3 py-2 font-mono text-[11px] leading-[1.55]"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.panelSurfaceAlt,
            color: theme.mutedText,
          }}
        >
          {message}
        </div>
      ) : null}

      <div className="d48-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {graphs.length === 0 && !loading ? (
          <div
            className="rounded-[8px] border px-3 py-3 font-mono text-[11px]"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.panelSurface,
              color: theme.mutedText,
            }}
          >
            No hay grafos guardados todavía.
          </div>
        ) : null}

        {graphs.map((graph) => (
          <button
            key={graph.id}
            type="button"
            onClick={() => graph.id && onLoad(graph.id)}
            className="rounded-[8px] border px-3 py-3 text-left transition-all hover:translate-y-[-1px]"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.panelSurface,
            }}
          >
            <div
              className="truncate font-mono text-[12px] font-semibold"
              style={{ color: theme.strongText }}
            >
              {graph.name}
            </div>
            <div
              className="mt-1 line-clamp-2 font-sans text-[12px] leading-[1.5]"
              style={{ color: theme.secondaryText }}
            >
              {graph.description || "Sin descripción"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
