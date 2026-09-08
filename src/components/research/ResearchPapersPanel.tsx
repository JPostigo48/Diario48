"use client";

import ResearchGraphView from "@/components/research/ResearchGraphView";
import ResearchSelectionMatrixView from "@/components/research/ResearchSelectionMatrixView";
import {
  workflowStatusClassNames,
  workflowStatusLabels,
} from "@/features/papers-review/paper-management/workflowStatus";
import {
  getPrimaryMethod,
  getPrimaryPerformance,
  renderTableValue,
} from "@/components/research/researchPaperFormatting";
import {
  ALL_COLUMNS,
  priorityLabels,
  readingStatusLabels,
  tagClassNames,
} from "@/components/research/researchUiConfig";
import type { PaperVisibleColumn } from "@/components/research/ResearchFiltersBar";
import type { ResearchLayer, ResearchPaper, PaperRelation } from "@/lib/research/types";
import { getLayerNameById, workspaceHasPdf } from "@/lib/research/utils";

type ResearchPapersPanelProps = {
  papers: ResearchPaper[];
  relations: PaperRelation[];
  layers: ResearchLayer[];
  selectedPaperId: string | null;
  onSelectPaper: (paperId: string) => void;
  viewMode: "cards" | "table" | "graph" | "selection";
  visibleColumns: PaperVisibleColumn[];
  saveMessage: string;
};

export default function ResearchPapersPanel({
  papers,
  relations,
  layers,
  selectedPaperId,
  onSelectPaper,
  viewMode,
  visibleColumns,
  saveMessage,
}: ResearchPapersPanelProps) {
  return (
    <div
      className={`flex min-w-0 flex-col bg-[var(--bg2)] ${
        viewMode === "cards"
          ? "w-[380px] shrink-0 border-r border-[var(--br)]"
          : "flex-1 border-r border-[var(--br)]"
      }`}
    >
      <div className="d48-scrollbar flex-1 overflow-y-auto p-2">
        {saveMessage ? (
          <div className="mb-2 border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[11px] text-[var(--tx2)]">
            {saveMessage}
          </div>
        ) : null}

        {papers.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-[var(--tx4)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="M17 17l3 3" />
            </svg>
            <p className="mt-2 text-[11px]">no hay papers con esos filtros</p>
          </div>
        ) : viewMode === "cards" ? (
          papers.map((paper) => (
            <button
              key={paper.id}
              type="button"
              onClick={() => onSelectPaper(paper.id)}
              className={`mb-1.5 w-full rounded border p-3 text-left transition-all ${
                selectedPaperId === paper.id
                  ? "border-[var(--tx)] bg-[var(--bg3)]"
                  : "border-[var(--br)] hover:border-[var(--tx3)]"
              }`}
            >
              <div className="mb-1 text-[11px] font-bold leading-snug text-[var(--tx)]">
                {paper.title}
              </div>
              <div className="mb-1.5 text-[10px] text-[var(--tx4)]">
                {paper.authors.join(", ") || "Autores sin registrar"} · {paper.year || "—"}
              </div>
              <div className="mb-1.5 flex flex-wrap gap-1">
                {paper.layerIds[0] ? (
                  <Tag label={getLayerNameById(layers, paper.layerIds[0])} type="layer" />
                ) : null}
                {paper.generalCategory ? (
                  <Tag label={paper.generalCategory} type="category" />
                ) : null}
                <WorkflowTag status={paper.workflowStatus} />
                <Tag label={priorityLabels[paper.priority]} type={priorityLabels[paper.priority]} />
                <Tag
                  label={readingStatusLabels[paper.readingStatus]}
                  type={readingStatusLabels[paper.readingStatus]}
                />
                {!workspaceHasPdf(paper) ? <Tag label="sin PDF" type="nopdf" /> : null}
              </div>
              <div className="flex justify-between text-[10px] text-[var(--tx4)]">
                <span>{getPrimaryMethod(paper)}</span>
                <span>
                  {paper.synthesisPromotion ? "promovido" : getPrimaryPerformance(paper)}
                </span>
              </div>
            </button>
          ))
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-[var(--br)]">
                  {ALL_COLUMNS.filter((column) => visibleColumns.includes(column.key)).map((column) => (
                    <th
                      key={column.key}
                      className="whitespace-nowrap px-2 py-1.5 text-left font-normal text-[var(--tx4)]"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {papers.map((paper) => (
                  <tr
                    key={paper.id}
                    onClick={() => onSelectPaper(paper.id)}
                    className={`cursor-pointer border-b border-[var(--br)] hover:bg-[var(--bg3)] ${
                      selectedPaperId === paper.id ? "bg-[var(--bg3)]" : ""
                    }`}
                  >
                    {ALL_COLUMNS.filter((column) => visibleColumns.includes(column.key)).map((column) => (
                      <td key={column.key} className="max-w-[140px] truncate px-2 py-1.5 text-[var(--tx2)]">
                        {renderTableValue(paper, column.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : viewMode === "graph" ? (
          <ResearchGraphView
            papers={papers}
            relations={relations}
            selectedPaperId={selectedPaperId}
            onSelectPaper={(paperId) => {
              if (paperId) {
                onSelectPaper(paperId);
              }
            }}
          />
        ) : (
          <ResearchSelectionMatrixView
            papers={papers}
            selectedPaperId={selectedPaperId}
            onSelectPaper={onSelectPaper}
          />
        )}
      </div>
    </div>
  );
}

function Tag({ label, type }: { label: string; type: string }) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
        tagClassNames[type] || "bg-[var(--bg3)] text-[var(--tx3)]"
      }`}
    >
      {label}
    </span>
  );
}

function WorkflowTag({ status }: { status: keyof typeof workflowStatusLabels }) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${workflowStatusClassNames[status]}`}
    >
      {workflowStatusLabels[status]}
    </span>
  );
}
