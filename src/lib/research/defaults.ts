import type {
  PaperAnalyticalClassification,
  PaperAnalyticalRole,
  PaperMetric,
  PaperPriority,
  PaperRelation,
  PaperRelationType,
  PaperSelectionCriterionEvaluation,
  PaperSelectionCriterionKey,
  PaperSectionNode,
  PaperSelectionEvaluation,
  PaperSynthesisPromotion,
  PaperWorkflowStatus,
  ReadingStatus,
  ResearchLayer,
  ResearchPaper,
  ResearchProject,
  ResearchWorkspace,
} from "./types";

export const readingStatusOptions: Array<{ value: ReadingStatus; label: string }> = [
  { value: "unread", label: "No leído" },
  { value: "partial", label: "Leído parcialmente" },
  { value: "read", label: "Leído" },
];

export const priorityOptions: Array<{ value: PaperPriority; label: string }> = [
  { value: "high", label: "Alta" },
  { value: "medium", label: "Media" },
  { value: "low", label: "Baja" },
];

export const workflowStatusOptions: Array<{ value: PaperWorkflowStatus; label: string }> = [
  { value: "registered", label: "Registrado" },
  { value: "screening", label: "En screening" },
  { value: "selected", label: "Seleccionado" },
  { value: "discarded", label: "Descartado" },
  { value: "contextual", label: "Contextual" },
  { value: "promoted-to-synthesis", label: "Promovido a síntesis" },
];

export const selectionCriteriaOptions: Array<{
  value: PaperSelectionCriterionKey;
  label: string;
}> = [
  { value: "topic-relevance", label: "Relevancia temática" },
  { value: "source-quality", label: "Calidad de fuente" },
  { value: "recency", label: "Actualidad" },
  { value: "reproducibility", label: "Reproducibilidad" },
  { value: "project-utility", label: "Utilidad para el proyecto" },
];

export const analyticalRoleOptions: Array<{ value: PaperAnalyticalRole; label: string }> = [
  { value: "core", label: "Núcleo" },
  { value: "methodological", label: "Metodológico" },
  { value: "context", label: "Contexto" },
  { value: "frontier", label: "Frontera" },
  { value: "seminal", label: "Seminal" },
  { value: "benchmark", label: "Benchmark" },
  { value: "bridge", label: "Puente" },
  { value: "pivot", label: "Pivote" },
];

export function createEmptySelectionCriterionEvaluation(
  criterionKey: PaperSelectionCriterionKey,
): PaperSelectionCriterionEvaluation {
  return {
    criterionKey,
    score: 0,
    comment: "",
  };
}

export function createEmptySelectionEvaluation(): PaperSelectionEvaluation {
  return {
    criteria: selectionCriteriaOptions.map((criterion) =>
      createEmptySelectionCriterionEvaluation(criterion.value),
    ),
    totalScore: 0,
    maxScore: selectionCriteriaOptions.length * 5,
    decision: null,
    overallComment: "",
    evaluatedAt: undefined,
  };
}

export function createEmptySynthesisPromotion(): PaperSynthesisPromotion | null {
  return null;
}

export function createEmptyAnalyticalClassification(): PaperAnalyticalClassification {
  return {
    role: null,
    note: "",
    classifiedAt: undefined,
  };
}

export const relationTypeOptions: Array<{
  value: PaperRelationType;
  label: string;
}> = [
  { value: "extends", label: "Extiende" },
  { value: "critiques", label: "Critica" },
  { value: "same-dataset", label: "Mismo dataset" },
  { value: "compares-with", label: "Compara con" },
  { value: "same-problem", label: "Mismo problema" },
  { value: "base-paper", label: "Paper base" },
  { value: "derived-paper", label: "Paper derivado" },
];

export function createEntityId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyProject(name = "Proyecto de revisión"): ResearchProject {
  const now = new Date().toISOString();

  return {
    name,
    description: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function createEmptyLayer(name = "Nueva capa", order = 0): ResearchLayer {
  const now = new Date().toISOString();

  return {
    id: createEntityId("layer"),
    name,
    order,
    description: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function createEmptyMetric(): PaperMetric {
  return {
    id: createEntityId("metric"),
    name: "",
    value: "",
    unit: "",
    observation: "",
  };
}

export function createEmptyStructureNode(level = 1): PaperSectionNode {
  return {
    id: createEntityId("section"),
    title: "",
    level,
    notes: "",
    highlight: false,
    children: [],
  };
}

export function createEmptyPaper(layerIds: string[] = []): ResearchPaper {
  const now = new Date().toISOString();

  return {
    id: createEntityId("paper"),
    title: "",
    authors: [],
    year: undefined,
    venue: "",
    doi: "",
    paperUrl: "",
    pdfUrl: "",
    abstract: "",
    personalSummary: "",
    keywords: [],
    generalCategory: "",
    subcategory: "",
    layerIds,
    objective: "",
    methods: [],
    datasets: [],
    performanceMetrics: [createEmptyMetric()],
    limitations: [""],
    futureChallenges: [""],
    researchUsefulness: "",
    personalNotes: "",
    structure: [createEmptyStructureNode(1)],
    readingStatus: "unread",
    priority: "medium",
    workflowStatus: "registered",
    selectionEvaluation: createEmptySelectionEvaluation(),
    synthesisPromotion: createEmptySynthesisPromotion(),
    analyticalClassification: createEmptyAnalyticalClassification(),
    createdAt: now,
    updatedAt: now,
  };
}

export function createEmptyRelation(): PaperRelation {
  return {
    id: createEntityId("relation"),
    fromPaperId: "",
    toPaperId: "",
    type: "extends",
    note: "",
  };
}

export function createEmptyWorkspace(name = "Proyecto de revisión"): ResearchWorkspace {
  const now = new Date().toISOString();

  return {
    visibility: "private",
    project: createEmptyProject(name),
    layers: [],
    papers: [],
    relations: [],
    createdAt: now,
    updatedAt: now,
  };
}

