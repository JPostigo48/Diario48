import { analyticalRoleOptions } from "@/lib/research/defaults";
import type { ResearchPaper } from "@/lib/research/types";

export const futureSynthesisFieldDefinitions = [
  { key: "objective", label: "problema / objetivo" },
  { key: "methods", label: "métodos" },
  { key: "datasets", label: "datasets" },
  { key: "performanceMetrics", label: "métricas y resultados" },
  { key: "limitations", label: "limitaciones" },
  { key: "futureChallenges", label: "trabajos futuros" },
  { key: "structure", label: "estructura del paper" },
] as const;

export const fieldsCurrentlyMixedButFutureScoped = [
  { key: "personalSummary", label: "resumen personal" },
  { key: "researchUsefulness", label: "utilidad para el proyecto" },
  { key: "personalNotes", label: "notas personales" },
] as const;

export const plannedSemanticHandlers = [
  "saveSelectionEvaluation",
  "promotePaperToSynthesis",
  "saveAnalyticalClassification",
  "saveSynthesisRecord",
] as const;

export const analyticalRoleLabels = Object.fromEntries(
  analyticalRoleOptions.map((option) => [option.value, option.label]),
) as Record<(typeof analyticalRoleOptions)[number]["value"], string>;

function hasMeaningfulValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0 && value.some((item) => hasMeaningfulValue(item));
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value && typeof value === "object") {
    return Object.values(value).some((entry) => hasMeaningfulValue(entry));
  }

  return false;
}

export function buildSynthesisPreparationReport(paper: ResearchPaper) {
  const missingFields = futureSynthesisFieldDefinitions.filter(
    (field) => !hasMeaningfulValue(paper[field.key]),
  );

  const readyForSynthesis =
    paper.workflowStatus === "promoted-to-synthesis" &&
    paper.synthesisPromotion !== null &&
    missingFields.length === 0;

  const readyToStartSynthesis =
    paper.workflowStatus === "promoted-to-synthesis" && paper.synthesisPromotion !== null;

  return {
    readyForSynthesis,
    readyToStartSynthesis,
    missingFields,
    futureSynthesisFields: futureSynthesisFieldDefinitions,
    mixedFields: fieldsCurrentlyMixedButFutureScoped,
  };
}
