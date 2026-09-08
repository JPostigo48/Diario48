"use client";

import { getLayerNameById } from "@/lib/research/utils";
import type { ResearchLayer, ResearchPaper } from "@/lib/research/types";

type PaperCardsViewProps = {
  papers: ResearchPaper[];
  layers: ResearchLayer[];
  selectedPaperId: string | null;
  onSelectPaper: (paperId: string) => void;
  onEditPaper: (paperId: string) => void;
  onDeletePaper: (paperId: string) => void;
};

export default function PaperCardsView({
  papers,
  layers,
  selectedPaperId,
  onSelectPaper,
  onEditPaper,
  onDeletePaper,
}: PaperCardsViewProps) {
  if (!papers.length) {
    return (
      <div className="rounded-[16px] border border-dashed border-[var(--br2)] bg-[var(--bg3)] px-5 py-10 text-center text-[13px] text-[var(--tx3)]">
        No hay papers que coincidan con los filtros. Empieza agregando bibliografía real.
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {papers.map((paper) => {
        const isActive = paper.id === selectedPaperId;
        const layerLabels = paper.layerIds.map((layerId) => getLayerNameById(layers, layerId));

        return (
          <article
            key={paper.id}
            className="rounded-[18px] border p-4 transition-all"
            style={{
              borderColor: isActive ? "var(--acc3)" : "var(--br)",
              backgroundColor: isActive ? "var(--acc2)" : "var(--bg2)",
            }}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="mb-1 text-[17px] font-semibold leading-snug text-[var(--tx)]">
                  {paper.title || "Sin título"}
                </div>
                <div className="text-[12px] text-[var(--tx3)]">
                  {paper.year || "—"} · {paper.venue || "venue sin registrar"}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEditPaper(paper.id)}
                  className="rounded-[10px] border border-[var(--br)] px-2.5 py-1 text-[11px] text-[var(--tx2)]"
                >
                  editar
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePaper(paper.id)}
                  className="rounded-[10px] border border-[var(--br)] px-2.5 py-1 text-[11px] text-[var(--tx2)]"
                >
                  borrar
                </button>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              <StatusPill value={paper.priority} />
              <StatusPill value={paper.readingStatus} />
              {layerLabels.map((label) => (
                <span
                  key={`${paper.id}-${label}`}
                  className="rounded-[999px] border border-[var(--br)] px-2 py-1 text-[10px] text-[var(--tx2)]"
                >
                  {label}
                </span>
              ))}
            </div>

            <p className="mb-4 line-clamp-4 text-[13px] leading-relaxed text-[var(--tx2)]">
              {paper.personalSummary || paper.abstract || "Sin resumen registrado todavía."}
            </p>

            <div className="mb-4 grid grid-cols-2 gap-2 text-[12px] text-[var(--tx3)]">
              <InfoItem label="método" value={paper.methods[0] || "—"} />
              <InfoItem label="dataset" value={paper.datasets[0] || "—"} />
              <InfoItem label="performance" value={formatPrimaryPerformance(paper) || "—"} />
              <InfoItem label="alineación" value={paper.researchUsefulness || "—"} />
            </div>

            <button
              type="button"
              onClick={() => onSelectPaper(paper.id)}
              className="w-full rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 font-mono text-[11px] text-[var(--tx2)]"
            >
              ver detalle
            </button>
          </article>
        );
      })}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[1.2px] text-[var(--tx3)]">
        {label}
      </div>
      <div className="line-clamp-2 text-[12px] text-[var(--tx2)]">{value}</div>
    </div>
  );
}

function StatusPill({ value }: { value: string }) {
  return (
    <span className="rounded-[999px] border border-[var(--br)] px-2 py-1 text-[10px] capitalize text-[var(--tx2)]">
      {value}
    </span>
  );
}

function formatPrimaryPerformance(paper: ResearchPaper) {
  const metric = paper.performanceMetrics.find(
    (item) => item.name || item.value || item.unit || item.observation,
  );

  if (!metric) {
    return "";
  }

  return [metric.name, metric.value, metric.unit].filter(Boolean).join(" ");
}
