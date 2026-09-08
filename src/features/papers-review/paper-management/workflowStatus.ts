import type {
  PaperSelectionDecision,
  PaperWorkflowStatus,
  ResearchWorkspace,
  ResearchPaper,
} from "@/lib/research/types";
import { upsertPaper } from "@/lib/research/utils";

export const workflowStatusLabels: Record<PaperWorkflowStatus, string> = {
  registered: "registrado",
  screening: "screening",
  selected: "seleccionado",
  discarded: "descartado",
  contextual: "contextual",
  "promoted-to-synthesis": "síntesis",
};

export const workflowStatusClassNames: Record<PaperWorkflowStatus, string> = {
  registered: "bg-slate-100 text-slate-700",
  screening: "bg-blue-50 text-blue-700",
  selected: "bg-emerald-50 text-emerald-700",
  discarded: "bg-rose-50 text-rose-700",
  contextual: "bg-violet-50 text-violet-700",
  "promoted-to-synthesis": "bg-amber-50 text-amber-700",
};

export const selectionDecisionToWorkflowStatus: Record<
  PaperSelectionDecision,
  PaperWorkflowStatus
> = {
  discarded: "discarded",
  contextual: "contextual",
  selected: "selected",
  "promoted-to-synthesis": "selected",
};

const workflowTransitions: Record<PaperWorkflowStatus, PaperWorkflowStatus[]> = {
  registered: ["screening", "contextual", "discarded"],
  screening: ["selected", "contextual", "discarded", "registered"],
  selected: ["promoted-to-synthesis", "contextual", "discarded", "screening"],
  contextual: ["screening", "selected", "discarded"],
  discarded: ["registered", "screening", "contextual"],
  "promoted-to-synthesis": ["selected", "contextual"],
};

export function getAvailableWorkflowTransitions(
  currentStatus: PaperWorkflowStatus,
): PaperWorkflowStatus[] {
  return workflowTransitions[currentStatus];
}

export function canTransitionWorkflowStatus(
  from: PaperWorkflowStatus,
  to: PaperWorkflowStatus,
) {
  return workflowTransitions[from].includes(to);
}

export function transitionPaperWorkflowStatus(
  paper: ResearchPaper,
  nextStatus: PaperWorkflowStatus,
): ResearchPaper {
  if (paper.workflowStatus === nextStatus) {
    return paper;
  }

  if (!canTransitionWorkflowStatus(paper.workflowStatus, nextStatus)) {
    throw new Error(
      `No se puede pasar de ${workflowStatusLabels[paper.workflowStatus]} a ${workflowStatusLabels[nextStatus]}.`,
    );
  }

  if (nextStatus === "promoted-to-synthesis") {
    throw new Error("La promoción a síntesis debe hacerse mediante la operación semántica dedicada.");
  }

  return {
    ...paper,
    workflowStatus: nextStatus,
  };
}

export function updatePaperWorkflowStatusInWorkspace(
  workspace: ResearchWorkspace,
  paperId: string,
  nextStatus: PaperWorkflowStatus,
): ResearchWorkspace {
  const targetPaper = workspace.papers.find((paper) => paper.id === paperId);

  if (!targetPaper) {
    throw new Error("No se encontró el paper a actualizar.");
  }

  const transitionedPaper = transitionPaperWorkflowStatus(targetPaper, nextStatus);

  return {
    ...workspace,
    papers: upsertPaper(workspace.papers, transitionedPaper),
  };
}

export function promotePaperToSynthesis(
  workspace: ResearchWorkspace,
  paperId: string,
  justification: string,
): ResearchWorkspace {
  const targetPaper = workspace.papers.find((paper) => paper.id === paperId);

  if (!targetPaper) {
    throw new Error("No se encontró el paper a promover.");
  }

  const normalizedJustification = justification.trim();

  if (!targetPaper.selectionEvaluation.evaluatedAt) {
    throw new Error("No se puede promover a síntesis sin una evaluación previa.");
  }

  if (targetPaper.selectionEvaluation.decision !== "promoted-to-synthesis") {
    throw new Error("La decisión final de la evaluación debe indicar promoción a síntesis.");
  }

  if (normalizedJustification.length < 12) {
    throw new Error("La promoción a síntesis requiere una justificación breve pero suficiente.");
  }

  const promotedPaper: ResearchPaper = {
    ...targetPaper,
    workflowStatus: "promoted-to-synthesis",
    synthesisPromotion: {
      promotedAt: new Date().toISOString(),
      justification: normalizedJustification,
      sourceDecision: "promoted-to-synthesis",
    },
  };

  return {
    ...workspace,
    papers: upsertPaper(workspace.papers, promotedPaper),
  };
}
