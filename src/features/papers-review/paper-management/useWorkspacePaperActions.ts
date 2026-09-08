"use client";

import { useCallback } from "react";
import type {
  PaperAnalyticalClassification,
  PaperRelation,
  PaperSelectionEvaluation,
  PaperWorkflowStatus,
  ResearchPaper,
} from "@/lib/research/types";
import {
  deletePaperFromWorkspace,
  promoteWorkspacePaperToSynthesis,
  savePaperToWorkspace,
  updatePaperAnalyticalClassification,
  updatePaperSelectionEvaluation,
  updatePaperWorkflowStatus,
  saveRelationToWorkspace,
} from "@/features/papers-review/paper-management/workspacePaperMutations";
import { workflowStatusLabels } from "@/features/papers-review/paper-management/workflowStatus";
import type { CommitWorkspaceDraft } from "@/features/papers-review/workspace-management/contracts";

type UseWorkspacePaperActionsOptions = {
  commitWorkspace: CommitWorkspaceDraft;
  onPaperSaved?: (paper: ResearchPaper) => void;
  onRelationSaved?: () => void;
  onPaperDeleted?: (paperId: string) => void;
  onWorkflowStatusChanged?: (paperId: string, nextStatus: PaperWorkflowStatus) => void;
  onSelectionEvaluationSaved?: (paperId: string) => void;
  onPaperPromotedToSynthesis?: (paperId: string) => void;
  onAnalyticalClassificationSaved?: (paperId: string) => void;
};

export function useWorkspacePaperActions({
  commitWorkspace,
  onPaperSaved,
  onRelationSaved,
  onPaperDeleted,
  onWorkflowStatusChanged,
  onSelectionEvaluationSaved,
  onPaperPromotedToSynthesis,
  onAnalyticalClassificationSaved,
}: UseWorkspacePaperActionsOptions) {
  const handleSavePaper = useCallback(
    async (paper: ResearchPaper) => {
      const savedWorkspace = await commitWorkspace(
        (current) => savePaperToWorkspace(current, paper),
        `Paper "${paper.title || "sin título"}" guardado.`,
      );

      if (savedWorkspace) {
        onPaperSaved?.(paper);
      }
    },
    [commitWorkspace, onPaperSaved],
  );

  const handleSaveRelation = useCallback(
    async (relation: PaperRelation) => {
      const savedWorkspace = await commitWorkspace(
        (current) => saveRelationToWorkspace(current, relation),
        "Relación guardada.",
      );

      if (savedWorkspace) {
        onRelationSaved?.();
      }
    },
    [commitWorkspace, onRelationSaved],
  );

  const handleDeletePaper = useCallback(
    async (paperId: string) => {
      const confirmed = window.confirm("¿Eliminar este paper?");
      if (!confirmed) {
        return;
      }

      const savedWorkspace = await commitWorkspace(
        (current) => deletePaperFromWorkspace(current, paperId),
        "Paper eliminado.",
      );

      if (savedWorkspace) {
        onPaperDeleted?.(paperId);
      }
    },
    [commitWorkspace, onPaperDeleted],
  );

  const handleWorkflowStatusChange = useCallback(
    async (paperId: string, nextStatus: PaperWorkflowStatus) => {
      const savedWorkspace = await commitWorkspace(
        (current) => updatePaperWorkflowStatus(current, paperId, nextStatus),
        `Paper movido a ${workflowStatusLabels[nextStatus]}.`,
      );

      if (savedWorkspace) {
        onWorkflowStatusChanged?.(paperId, nextStatus);
      }
    },
    [commitWorkspace, onWorkflowStatusChanged],
  );

  const handleSelectionEvaluationSave = useCallback(
    async (paperId: string, selectionEvaluation: PaperSelectionEvaluation) => {
      const savedWorkspace = await commitWorkspace(
        (current) => updatePaperSelectionEvaluation(current, paperId, selectionEvaluation),
        "Evaluación de selección guardada.",
      );

      if (savedWorkspace) {
        onSelectionEvaluationSaved?.(paperId);
      }
    },
    [commitWorkspace, onSelectionEvaluationSaved],
  );

  const handlePromoteToSynthesis = useCallback(
    async (paperId: string, justification: string) => {
      const savedWorkspace = await commitWorkspace(
        (current) => promoteWorkspacePaperToSynthesis(current, paperId, justification),
        "Paper promovido a síntesis.",
      );

      if (savedWorkspace) {
        onPaperPromotedToSynthesis?.(paperId);
      }
    },
    [commitWorkspace, onPaperPromotedToSynthesis],
  );

  const handleAnalyticalClassificationSave = useCallback(
    async (paperId: string, analyticalClassification: PaperAnalyticalClassification) => {
      const savedWorkspace = await commitWorkspace(
        (current) =>
          updatePaperAnalyticalClassification(current, paperId, analyticalClassification),
        "Clasificación analítica guardada.",
      );

      if (savedWorkspace) {
        onAnalyticalClassificationSaved?.(paperId);
      }
    },
    [commitWorkspace, onAnalyticalClassificationSaved],
  );

  return {
    savePaper: handleSavePaper,
    saveRelation: handleSaveRelation,
    deletePaper: handleDeletePaper,
    changeWorkflowStatus: handleWorkflowStatusChange,
    saveSelectionEvaluation: handleSelectionEvaluationSave,
    promoteToSynthesis: handlePromoteToSynthesis,
    saveAnalyticalClassification: handleAnalyticalClassificationSave,
  };
}
