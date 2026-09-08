"use client";

import {
  getAvailableWorkflowTransitions,
  workflowStatusClassNames,
  workflowStatusLabels,
} from "@/features/papers-review/paper-management/workflowStatus";
import {
  getSelectionCriterionLabel,
  hasSelectionEvaluation,
  selectionDecisionLabels,
} from "@/features/papers-review/paper-management/selectionMatrix";
import {
  formatListSummary,
  getPrimaryPerformance,
} from "@/components/research/researchPaperFormatting";
import { primarySmallButtonClassName, priorityLabels, readingStatusLabels, smallButtonClassName } from "@/components/research/researchUiConfig";
import type { ResearchLayer, ResearchPaper, PaperSectionNode } from "@/lib/research/types";
import { getLayerNameById } from "@/lib/research/utils";
import SelectionEvaluationEditor from "./SelectionEvaluationEditor";
import SynthesisPreparationPanel from "./SynthesisPreparationPanel";
import SynthesisPromotionPanel from "./SynthesisPromotionPanel";

type ResearchInspectorPanelProps = {
  selectedPaper: ResearchPaper | null;
  layers: ResearchLayer[];
  onEdit: () => void;
  onDelete: () => void;
  onWorkflowStatusChange: (paperId: string, nextStatus: ResearchPaper["workflowStatus"]) => void;
  onSaveSelectionEvaluation: (
    paperId: string,
    selectionEvaluation: ResearchPaper["selectionEvaluation"],
  ) => void;
  onPromoteToSynthesis: (paperId: string, justification: string) => void;
  onSaveAnalyticalClassification: (
    paperId: string,
    analyticalClassification: ResearchPaper["analyticalClassification"],
  ) => void;
};

export default function ResearchInspectorPanel({
  selectedPaper,
  layers,
  onEdit,
  onDelete,
  onWorkflowStatusChange,
  onSaveSelectionEvaluation,
  onPromoteToSynthesis,
  onSaveAnalyticalClassification,
}: ResearchInspectorPanelProps) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden border-l border-[var(--br)] bg-[var(--bg2)]">
      <div className="flex h-8 shrink-0 items-center border-b border-[var(--br)] px-3">
        <p className="text-[10px] uppercase tracking-wider text-[var(--tx4)]">{"// inspector"}</p>
      </div>

      <div className="d48-scrollbar flex-1 overflow-y-auto">
        {!selectedPaper ? (
          <div className="p-4">
            <p className="mt-2 text-[11px] text-[var(--tx4)]">
              Selecciona un paper para ver su detalle, notas y visor PDF.
            </p>
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span
                  className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${workflowStatusClassNames[selectedPaper.workflowStatus]}`}
                >
                  fase: {workflowStatusLabels[selectedPaper.workflowStatus]}
                </span>
              </div>
              <div className="flex gap-1.5">
                <button type="button" className={smallButtonClassName} onClick={onEdit}>
                  editar
                </button>
                <button
                  type="button"
                  className="rounded border border-red-200 px-2 py-1 text-[10px] text-red-500 hover:bg-red-50"
                  onClick={onDelete}
                >
                  eliminar
                </button>
              </div>
            </div>

            <h2 className="mb-1 text-[13px] font-bold leading-snug text-[var(--tx)]">
              {selectedPaper.title}
            </h2>
            <p className="mb-3 text-[11px] text-[var(--tx3)]">
              {selectedPaper.authors.join(", ") || "Autores sin registrar"} · {selectedPaper.year || "—"}
              {selectedPaper.venue ? ` · ${selectedPaper.venue}` : ""}
            </p>

            <div className="mb-3 grid grid-cols-1 gap-2">
              {[
                {
                  label: "capa",
                  value: selectedPaper.layerIds[0]
                    ? getLayerNameById(layers, selectedPaper.layerIds[0])
                    : "—",
                },
                { label: "subcategoría", value: selectedPaper.subcategory || "—" },
                { label: "categoría", value: selectedPaper.generalCategory || "—" },
                {
                  label: "fase metodológica",
                  value: workflowStatusLabels[selectedPaper.workflowStatus],
                },
                { label: "prioridad", value: priorityLabels[selectedPaper.priority] },
                { label: "estado", value: readingStatusLabels[selectedPaper.readingStatus] },
                { label: "datasets", value: formatListSummary(selectedPaper.datasets) },
                { label: "métodos", value: formatListSummary(selectedPaper.methods) },
                { label: "performance", value: getPrimaryPerformance(selectedPaper) },
                { label: "alineación", value: selectedPaper.researchUsefulness || "—" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="mb-0.5 text-[9px] uppercase tracking-wider text-[var(--tx4)]">
                    {item.label}
                  </p>
                  <p className="border-b border-[var(--br)] pb-0.5 text-[11px] text-[var(--tx2)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-3 rounded border border-[var(--br)] bg-[var(--bg3)] p-3">
              <p className="mb-2 text-[9px] uppercase tracking-wider text-[var(--tx4)]">
                transiciones disponibles
              </p>
              <div className="flex flex-wrap gap-2">
                {getAvailableWorkflowTransitions(selectedPaper.workflowStatus).map((nextStatus) => (
                  <button
                    key={nextStatus}
                    type="button"
                    className="rounded border border-[var(--br)] bg-[var(--bg)] px-2 py-1 text-[10px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg2)]"
                    onClick={() => onWorkflowStatusChange(selectedPaper.id, nextStatus)}
                  >
                    mover a {workflowStatusLabels[nextStatus]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              {hasSelectionEvaluation(selectedPaper) ? (
                <div className="mb-3 rounded border border-[var(--br)] bg-[var(--bg3)] p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[9px] uppercase tracking-wider text-[var(--tx4)]">
                      evaluación actual
                    </p>
                    <span className="text-[10px] text-[var(--tx3)]">
                      {selectedPaper.selectionEvaluation.totalScore}/
                      {selectedPaper.selectionEvaluation.maxScore}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {selectedPaper.selectionEvaluation.criteria.map((criterion) => (
                      <div
                        key={criterion.criterionKey}
                        className="flex items-center justify-between gap-2 text-[10px] text-[var(--tx2)]"
                      >
                        <span>{getSelectionCriterionLabel(criterion.criterionKey)}</span>
                        <span>{criterion.score}/5</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 border-t border-[var(--br)] pt-2 text-[10px] text-[var(--tx2)]">
                    decisión:{" "}
                    {selectedPaper.selectionEvaluation.decision
                      ? selectionDecisionLabels[selectedPaper.selectionEvaluation.decision]
                      : "sin decisión"}
                  </div>
                </div>
              ) : null}

              <SelectionEvaluationEditor
                paper={selectedPaper}
                onSave={(selectionEvaluation) =>
                  onSaveSelectionEvaluation(selectedPaper.id, selectionEvaluation)
                }
              />
            </div>

            <div className="mb-3">
              <SynthesisPromotionPanel
                paper={selectedPaper}
                onPromote={(justification) =>
                  onPromoteToSynthesis(selectedPaper.id, justification)
                }
              />
            </div>

            <div className="mb-3">
              <SynthesisPreparationPanel
                paper={selectedPaper}
                onSaveAnalyticalClassification={(analyticalClassification) =>
                  onSaveAnalyticalClassification(selectedPaper.id, analyticalClassification)
                }
              />
            </div>

            {selectedPaper.limitations.length ? (
              <div className="mb-2">
                <p className="mb-0.5 text-[9px] uppercase tracking-wider text-[var(--tx4)]">
                  limitaciones
                </p>
                <ul className="list-disc pl-4 text-[11px] text-[var(--tx2)]">
                  {selectedPaper.limitations.map((item, index) => (
                    <li key={`${selectedPaper.id}-limitation-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {selectedPaper.futureChallenges.length ? (
              <div className="mb-2">
                <p className="mb-0.5 text-[9px] uppercase tracking-wider text-[var(--tx4)]">
                  desafíos futuros
                </p>
                <ul className="list-disc pl-4 text-[11px] text-[var(--tx2)]">
                  {selectedPaper.futureChallenges.map((item, index) => (
                    <li key={`${selectedPaper.id}-challenge-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {selectedPaper.structure.length ? (
              <div className="mt-2 border-t border-[var(--br)] pt-2">
                <p className="mb-1 text-[9px] uppercase tracking-wider text-[var(--tx4)]">
                  estructura del paper
                </p>
                <PaperStructureTree nodes={selectedPaper.structure} />
              </div>
            ) : null}

            {selectedPaper.abstract ? (
              <div className="mt-2 border-t border-[var(--br)] pt-2">
                <p className="mb-1 text-[9px] uppercase tracking-wider text-[var(--tx4)]">abstract</p>
                <p className="text-[11px] leading-relaxed text-[var(--tx2)]">
                  {selectedPaper.abstract}
                </p>
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedPaper.paperUrl ? (
                <a
                  href={selectedPaper.paperUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={primarySmallButtonClassName}
                >
                  abrir paper ↗
                </a>
              ) : null}
              {!selectedPaper.pdfUrl ? (
                <span className="self-center text-[10px] text-red-400">sin PDF disponible</span>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PaperStructureTree({ nodes }: { nodes: PaperSectionNode[] }) {
  if (!nodes.length) {
    return <p className="text-[11px] text-[var(--tx4)]">No se registró estructura todavía.</p>;
  }

  return (
    <ul className="space-y-1.5 text-[11px] text-[var(--tx2)]">
      {nodes.map((node) => (
        <PaperStructureTreeNode key={node.id} node={node} />
      ))}
    </ul>
  );
}

function PaperStructureTreeNode({ node }: { node: PaperSectionNode }) {
  return (
    <li className="rounded border border-[var(--br)] bg-[var(--bg3)] px-2 py-1.5">
      <div className="flex items-center gap-2">
        <span className="rounded bg-[var(--bg)] px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-[var(--tx4)]">
          h{node.level}
        </span>
        <span className="font-semibold text-[var(--tx)]">{node.title || "sección sin título"}</span>
        {node.highlight ? (
          <span className="rounded bg-[var(--acc2)] px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-[var(--acc)]">
            clave
          </span>
        ) : null}
      </div>
      {node.notes ? <p className="mt-1 text-[10px] leading-relaxed text-[var(--tx3)]">{node.notes}</p> : null}
      {node.children.length ? (
        <div className="mt-2 border-l border-[var(--br)] pl-3">
          <PaperStructureTree nodes={node.children} />
        </div>
      ) : null}
    </li>
  );
}
