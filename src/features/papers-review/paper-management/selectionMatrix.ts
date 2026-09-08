import {
  createEmptySelectionEvaluation,
  selectionCriteriaOptions,
} from "@/lib/research/defaults";
import type {
  PaperSelectionDecision,
  PaperSelectionEvaluation,
  ResearchPaper,
} from "@/lib/research/types";
import { normalizeSelectionEvaluation } from "@/lib/research/utils";

export const selectionDecisionLabels: Record<PaperSelectionDecision, string> = {
  discarded: "descartar",
  contextual: "contexto",
  selected: "seleccionado",
  "promoted-to-synthesis": "promover a síntesis",
};

export function getSelectionCriterionLabel(criterionKey: string) {
  return (
    selectionCriteriaOptions.find((criterion) => criterion.value === criterionKey)?.label ??
    criterionKey
  );
}

export function createSelectionEvaluationDraft(
  base?: Partial<PaperSelectionEvaluation> | null,
) {
  return normalizeSelectionEvaluation(base ?? createEmptySelectionEvaluation());
}

export function hasSelectionEvaluation(paper: ResearchPaper) {
  return (
    paper.selectionEvaluation.totalScore > 0 ||
    Boolean(paper.selectionEvaluation.decision) ||
    Boolean(paper.selectionEvaluation.overallComment)
  );
}

export function isReadyForSynthesisPromotion(paper: ResearchPaper) {
  return (
    hasSelectionEvaluation(paper) &&
    paper.selectionEvaluation.decision === "promoted-to-synthesis" &&
    !paper.synthesisPromotion
  );
}
