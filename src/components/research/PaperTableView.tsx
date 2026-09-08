"use client";

import { getLayerNameById } from "@/lib/research/utils";
import type { ResearchLayer, ResearchPaper } from "@/lib/research/types";
import type { PaperVisibleColumn } from "./ResearchToolbar";

type PaperTableViewProps = {
  papers: ResearchPaper[];
  layers: ResearchLayer[];
  visibleColumns: PaperVisibleColumn[];
  onSelectPaper: (paperId: string) => void;
};

const columnLabels: Record<PaperVisibleColumn, string> = {
  title: "Título",
  year: "Año",
  venue: "Venue",
  dataset: "Dataset",
  method: "Método",
  performance: "Performance",
  limitations: "Limitaciones",
  researchUsefulness: "Alineación",
  priority: "Prioridad",
  readingStatus: "Lectura",
};

export default function PaperTableView({
  papers,
  layers,
  visibleColumns,
  onSelectPaper,
}: PaperTableViewProps) {
  if (!papers.length) {
    return (
      <div className="rounded-[16px] border border-dashed border-[var(--br2)] bg-[var(--bg3)] px-5 py-10 text-center text-[13px] text-[var(--tx3)]">
        No hay resultados para comparar en tabla.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-[var(--br)] bg-[var(--bg2)]">
      <div className="d48-scrollbar overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-[var(--bg3)]">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column}
                  className="border-b border-[var(--br)] px-3 py-3 font-mono text-[11px] uppercase tracking-[1.2px] text-[var(--tx3)]"
                >
                  {columnLabels[column]}
                </th>
              ))}
              <th className="border-b border-[var(--br)] px-3 py-3 font-mono text-[11px] uppercase tracking-[1.2px] text-[var(--tx3)]">
                Capas
              </th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper) => (
              <tr
                key={paper.id}
                className="cursor-pointer transition-colors hover:bg-[var(--acc2)]"
                onClick={() => onSelectPaper(paper.id)}
              >
                {visibleColumns.map((column) => (
                  <td
                    key={`${paper.id}-${column}`}
                    className="max-w-[260px] border-b border-[var(--br)] px-3 py-3 text-[13px] text-[var(--tx2)]"
                  >
                    {resolveCellValue(paper, column)}
                  </td>
                ))}
                <td className="border-b border-[var(--br)] px-3 py-3 text-[13px] text-[var(--tx2)]">
                  <div className="flex flex-wrap gap-1">
                    {paper.layerIds.length
                      ? paper.layerIds.map((layerId) => (
                          <span
                            key={`${paper.id}-${layerId}`}
                            className="rounded-[999px] border border-[var(--br)] px-2 py-1 text-[10px]"
                          >
                            {getLayerNameById(layers, layerId)}
                          </span>
                        ))
                      : "Sin capa"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function resolveCellValue(paper: ResearchPaper, column: PaperVisibleColumn) {
  switch (column) {
    case "title":
      return paper.title || "—";
    case "year":
      return paper.year || "—";
    case "venue":
      return paper.venue || "—";
    case "dataset":
      return paper.datasets[0] || "—";
    case "method":
      return paper.methods[0] || "—";
    case "performance": {
      const metric = paper.performanceMetrics.find(
        (item) => item.name || item.value || item.unit || item.observation,
      );
      return metric ? [metric.name, metric.value, metric.unit].filter(Boolean).join(" ") : "—";
    }
    case "limitations":
      return paper.limitations.length ? paper.limitations.join(" · ") : "—";
    case "researchUsefulness":
      return paper.researchUsefulness || "—";
    case "priority":
      return paper.priority;
    case "readingStatus":
      return paper.readingStatus;
    default:
      return "—";
  }
}
