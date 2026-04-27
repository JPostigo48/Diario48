import type { GraphData } from "@/lib/graph/types";

type SavedGraphsPanelProps = {
  graphs: GraphData[];
  loading: boolean;
  message?: string;
  onRefresh: () => void;
  onLoad: (graphId: string) => void;
};

export default function SavedGraphsPanel({
  graphs,
  loading,
  message,
  onRefresh,
  onLoad,
}: SavedGraphsPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px] text-[#2a3040]">
        {"// grafos guardados"}
      </div>

      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-[4px] border border-[#1a1d28] px-2.5 py-1 font-mono text-[10px] text-[#6b7280] transition-all hover:border-[#2a3040] hover:text-[#9ca3af]"
        >
          recargar
        </button>
        {loading ? (
          <span className="font-mono text-[9px] text-[#4f8ef7]">cargando…</span>
        ) : null}
      </div>

      {message ? (
        <div className="mb-2 rounded-[4px] border border-[#4f8ef733] bg-[#4f8ef710] px-2.5 py-2 font-mono text-[9px] leading-[1.5] text-[#6b7280]">
          {message}
        </div>
      ) : null}

      <div className="d48-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {graphs.length === 0 && !loading ? (
          <div className="rounded-[6px] border border-[#1a1d28] bg-[#111318] px-3 py-2.5 font-mono text-[10px] text-[#2a3040]">
            No hay grafos guardados todavía.
          </div>
        ) : null}

        {graphs.map((graph) => (
          <button
            key={graph.id}
            type="button"
            onClick={() => graph.id && onLoad(graph.id)}
            className="rounded-[6px] border border-[#1a1d28] bg-[#111318] px-3 py-2.5 text-left transition-all hover:border-[#4f8ef744] hover:bg-[#13151e]"
          >
            <div className="truncate font-mono text-[10px] text-[#dde1ea]">
              {graph.name}
            </div>
            <div className="mt-1 line-clamp-2 font-mono text-[9px] leading-[1.5] text-[#4b5563]">
              {graph.description || "Sin descripción"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
