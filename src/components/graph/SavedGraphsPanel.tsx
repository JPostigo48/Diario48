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
        className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px]"
        style={{ color: theme.dimText }}
      >
        {"// grafos guardados"}
      </div>

      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-[4px] border px-2.5 py-1 font-mono text-[10px] transition-all"
          style={{ borderColor: theme.border, color: theme.mutedText }}
        >
          recargar
        </button>
        {loading ? (
          <span className="font-mono text-[9px]" style={{ color: theme.accent }}>
            cargando…
          </span>
        ) : null}
      </div>

      {message ? (
        <div
          className="mb-2 rounded-[4px] border px-2.5 py-2 font-mono text-[9px] leading-[1.5]"
          style={{
            borderColor: `${theme.accent}33`,
            backgroundColor: theme.accentSoft,
            color: theme.mutedText,
          }}
        >
          {message}
        </div>
      ) : null}

      <div className="d48-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {graphs.length === 0 && !loading ? (
          <div
            className="rounded-[6px] border px-3 py-2.5 font-mono text-[10px]"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.panelSurface,
              color: theme.dimText,
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
            className="rounded-[6px] border px-3 py-2.5 text-left transition-all"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.panelSurface,
            }}
          >
            <div className="truncate font-mono text-[10px]" style={{ color: theme.strongText }}>
              {graph.name}
            </div>
            <div
              className="mt-1 line-clamp-2 font-mono text-[9px] leading-[1.5]"
              style={{ color: theme.mutedText }}
            >
              {graph.description || "Sin descripción"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
