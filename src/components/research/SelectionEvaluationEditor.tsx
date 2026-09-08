"use client";

import { useMemo, useState } from "react";
import {
  createEmptySelectionEvaluation,
  selectionCriteriaOptions,
} from "@/lib/research/defaults";
import type {
  PaperSelectionDecision,
  PaperSelectionEvaluation,
  ResearchPaper,
} from "@/lib/research/types";
import {
  createSelectionEvaluationDraft,
  selectionDecisionLabels,
} from "@/features/papers-review/paper-management/selectionMatrix";

type SelectionEvaluationEditorProps = {
  paper: ResearchPaper;
  onSave: (selectionEvaluation: PaperSelectionEvaluation) => void;
};

export default function SelectionEvaluationEditor({
  paper,
  onSave,
}: SelectionEvaluationEditorProps) {
  const [draft, setDraft] = useState<PaperSelectionEvaluation>(() =>
    createSelectionEvaluationDraft(paper.selectionEvaluation ?? createEmptySelectionEvaluation()),
  );

  const totalScore = useMemo(
    () => draft.criteria.reduce((sum, criterion) => sum + criterion.score, 0),
    [draft.criteria],
  );

  const maxScore = selectionCriteriaOptions.length * 5;

  return (
    <div className="rounded border border-[var(--br)] bg-[var(--bg3)] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-[var(--tx4)]">
            matriz de selección
          </p>
          <p className="mt-1 text-[11px] text-[var(--tx3)]">
            evalúa el paper con criterios homogéneos antes de decidir su avance
          </p>
        </div>
        <div className="rounded border border-[var(--br)] bg-[var(--bg)] px-2 py-1 text-[10px] text-[var(--tx2)]">
          score: {totalScore}/{maxScore}
        </div>
      </div>

      <div className="space-y-2">
        {selectionCriteriaOptions.map((criterion) => {
          const currentCriterion = draft.criteria.find(
            (item) => item.criterionKey === criterion.value,
          );

          return (
            <div key={criterion.value} className="rounded border border-[var(--br)] bg-[var(--bg)] p-2">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium text-[var(--tx)]">{criterion.label}</p>
                <select
                  className="rounded border border-[var(--br)] bg-[var(--bg2)] px-2 py-1 text-[10px] text-[var(--tx)]"
                  value={currentCriterion?.score ?? 0}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      criteria: current.criteria.map((item) =>
                        item.criterionKey === criterion.value
                          ? { ...item, score: Number(event.target.value) }
                          : item,
                      ),
                    }))
                  }
                >
                  {[0, 1, 2, 3, 4, 5].map((score) => (
                    <option key={score} value={score}>
                      {score}/5
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={currentCriterion?.comment ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    criteria: current.criteria.map((item) =>
                      item.criterionKey === criterion.value
                        ? { ...item, comment: event.target.value }
                        : item,
                    ),
                  }))
                }
                rows={2}
                className="w-full rounded border border-[var(--br)] bg-[var(--bg2)] px-2 py-1.5 text-[11px] text-[var(--tx)] outline-none"
                placeholder="comentario breve opcional"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
        <textarea
          value={draft.overallComment}
          onChange={(event) =>
            setDraft((current) => ({ ...current, overallComment: event.target.value }))
          }
          rows={3}
          className="w-full rounded border border-[var(--br)] bg-[var(--bg)] px-2 py-1.5 text-[11px] text-[var(--tx)] outline-none"
          placeholder="comentario general de la evaluación"
        />
        <div className="space-y-2">
          <select
            value={draft.decision ?? ""}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                decision: (event.target.value || null) as PaperSelectionDecision | null,
              }))
            }
            className="w-full rounded border border-[var(--br)] bg-[var(--bg)] px-2 py-1.5 text-[11px] text-[var(--tx)] outline-none"
          >
            <option value="">Sin decisión final</option>
            {Object.entries(selectionDecisionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="w-full rounded border border-[var(--acc3)] bg-[var(--acc2)] px-3 py-2 text-[11px] text-[var(--tx)]"
            onClick={() =>
              onSave({
                ...draft,
                totalScore,
                maxScore,
                evaluatedAt: new Date().toISOString(),
              })
            }
          >
            guardar evaluación
          </button>
        </div>
      </div>
    </div>
  );
}
