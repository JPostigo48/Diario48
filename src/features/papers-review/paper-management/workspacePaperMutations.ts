import type {
  PaperAnalyticalClassification,
  PaperRelation,
  PaperSelectionEvaluation,
  PaperWorkflowStatus,
  ResearchPaper,
  ResearchWorkspace,
} from "@/lib/research/types";
import {
  removePaperFromWorkspace,
  upsertPaper,
  upsertRelation,
} from "@/lib/research/utils";
import {
  selectionDecisionToWorkflowStatus,
  promotePaperToSynthesis,
  updatePaperWorkflowStatusInWorkspace,
} from "./workflowStatus";

export function savePaperToWorkspace(
  workspace: ResearchWorkspace,
  paper: ResearchPaper,
): ResearchWorkspace {
  const nextPaper =
    paper.selectionEvaluation.decision
      ? {
          ...paper,
          workflowStatus:
            selectionDecisionToWorkflowStatus[paper.selectionEvaluation.decision],
        }
      : paper;

  return {
    ...workspace,
    papers: upsertPaper(workspace.papers, nextPaper),
  };
}

export function saveRelationToWorkspace(
  workspace: ResearchWorkspace,
  relation: PaperRelation,
): ResearchWorkspace {
  return {
    ...workspace,
    relations: upsertRelation(workspace.relations, relation),
  };
}

export function deletePaperFromWorkspace(
  workspace: ResearchWorkspace,
  paperId: string,
): ResearchWorkspace {
  return removePaperFromWorkspace(workspace, paperId);
}

export function updatePaperWorkflowStatus(
  workspace: ResearchWorkspace,
  paperId: string,
  nextStatus: PaperWorkflowStatus,
): ResearchWorkspace {
  return updatePaperWorkflowStatusInWorkspace(workspace, paperId, nextStatus);
}

export function updatePaperSelectionEvaluation(
  workspace: ResearchWorkspace,
  paperId: string,
  selectionEvaluation: PaperSelectionEvaluation,
): ResearchWorkspace {
  const targetPaper = workspace.papers.find((paper) => paper.id === paperId);

  if (!targetPaper) {
    throw new Error("No se encontró el paper a evaluar.");
  }

  const nextPaper: ResearchPaper = {
    ...targetPaper,
    selectionEvaluation,
    workflowStatus:
      targetPaper.workflowStatus === "promoted-to-synthesis"
        ? "promoted-to-synthesis"
        : selectionEvaluation.decision
          ? selectionDecisionToWorkflowStatus[selectionEvaluation.decision]
          : targetPaper.workflowStatus,
    synthesisPromotion:
      selectionEvaluation.decision === "promoted-to-synthesis" || !targetPaper.synthesisPromotion
        ? targetPaper.synthesisPromotion
        : null,
  };

  return {
    ...workspace,
    papers: upsertPaper(workspace.papers, nextPaper),
  };
}

export function promoteWorkspacePaperToSynthesis(
  workspace: ResearchWorkspace,
  paperId: string,
  justification: string,
): ResearchWorkspace {
  return promotePaperToSynthesis(workspace, paperId, justification);
}

export function updatePaperAnalyticalClassification(
  workspace: ResearchWorkspace,
  paperId: string,
  analyticalClassification: PaperAnalyticalClassification,
): ResearchWorkspace {
  const targetPaper = workspace.papers.find((paper) => paper.id === paperId);

  if (!targetPaper) {
    throw new Error("No se encontró el paper a clasificar.");
  }

  const nextPaper: ResearchPaper = {
    ...targetPaper,
    analyticalClassification,
  };

  return {
    ...workspace,
    papers: upsertPaper(workspace.papers, nextPaper),
  };
}
