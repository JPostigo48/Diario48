import type { PaperRelation, ResearchPaper, ResearchWorkspace } from "@/lib/research/types";
import {
  createEmptyAnalyticalClassification,
  createEmptySelectionEvaluation,
  createEmptySynthesisPromotion,
} from "@/lib/research/defaults";
import { ensureWorkspaceShape } from "@/lib/research/utils";
import type { PaperVisibleColumn } from "@/components/research/ResearchFiltersBar";

export function exportWorkspaceJson(workspace: ResearchWorkspace) {
  const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${workspace.project.name.replace(/\s+/g, "_").toLowerCase() || "papers_review"}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadWorkspaceTemplateJson(workspace: ResearchWorkspace, visibleColumns: PaperVisibleColumn[]) {
  const basePaper: ResearchPaper = {
    id: "paper_001",
    title: "",
    authors: ["Apellido, Nombre"],
    year: new Date().getFullYear(),
    venue: "",
    doi: "",
    paperUrl: "",
    pdfUrl: "",
    abstract: "",
    personalSummary: "",
    keywords: [],
    generalCategory: "",
    subcategory: "",
    layerIds: workspace.layers[0] ? [workspace.layers[0].id] : [],
    objective: "",
    methods: [""],
    datasets: [""],
    performanceMetrics: [{ id: "metric_001", name: "", value: "", unit: "", observation: "" }],
    limitations: [""],
    futureChallenges: [""],
    researchUsefulness: "",
    personalNotes: "",
    structure: [{ id: "section_001", title: "Introduction", level: 1, notes: "", highlight: false, children: [] }],
    workflowStatus: "registered",
    selectionEvaluation: createEmptySelectionEvaluation(),
    synthesisPromotion: createEmptySynthesisPromotion(),
    analyticalClassification: createEmptyAnalyticalClassification(),
    readingStatus: "unread",
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const visibleFieldMap: Record<PaperVisibleColumn, keyof ResearchPaper> = {
    title: "title",
    year: "year",
    venue: "venue",
    dataset: "datasets",
    method: "methods",
    performance: "performanceMetrics",
    limitations: "limitations",
    researchUsefulness: "researchUsefulness",
    priority: "priority",
    readingStatus: "readingStatus",
  };

  const orderedFields = Array.from(new Set<keyof ResearchPaper>([
    "id", "title", "authors", "year", "layerIds",
    ...visibleColumns.map((column) => visibleFieldMap[column]),
    "venue", "doi", "paperUrl", "pdfUrl", "abstract", "personalSummary",
    "keywords", "generalCategory", "subcategory", "objective", "methods",
    "datasets", "performanceMetrics", "limitations", "futureChallenges",
    "researchUsefulness", "personalNotes", "structure", "workflowStatus", "selectionEvaluation", "synthesisPromotion", "analyticalClassification", "readingStatus",
    "priority", "createdAt", "updatedAt",
  ]));

  const paperTemplate = orderedFields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field] = basePaper[field];
    return acc;
  }, {}) as unknown as ResearchPaper;

  const template = {
    _meta: { visibleColumns, articleFields: orderedFields },
    project: { name: workspace.project.name, description: workspace.project.description },
    layers: workspace.layers.map((layer, index) => ({
      id: layer.id || `layer_${index + 1}`,
      name: layer.name,
      order: layer.order,
      description: layer.description ?? "",
    })),
    papers: [paperTemplate],
    relations: [] as PaperRelation[],
  };

  const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${workspace.project.name.replace(/\s+/g, "_").toLowerCase() || "papers_review"}_template.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function parseImportedWorkspace(file: File) {
  const text = await file.text();
  return ensureWorkspaceShape(JSON.parse(text) as ResearchWorkspace);
}
