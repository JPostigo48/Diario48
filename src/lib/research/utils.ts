import {
  createEmptyAnalyticalClassification,
  createEmptyLayer,
  createEmptyMetric,
  createEmptyPaper,
  createEmptyProject,
  createEmptySelectionEvaluation,
  createEmptyStructureNode,
  createEntityId,
  selectionCriteriaOptions,
} from "./defaults";
import type {
  PaperAnalyticalClassification,
  PaperMetric,
  PaperRelation,
  PaperSelectionCriterionEvaluation,
  PaperSelectionEvaluation,
  PaperSectionNode,
  ResearchLayer,
  ResearchPaper,
  ResearchProject,
  ResearchWorkspace,
} from "./types";

export function normalizeTextList(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function sortLayers(layers: ResearchLayer[]) {
  return [...layers].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function moveLayer(
  layers: ResearchLayer[],
  layerId: string,
  direction: "up" | "down",
) {
  const ordered = sortLayers(layers);
  const index = ordered.findIndex((layer) => layer.id === layerId);

  if (index === -1) {
    return ordered;
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex >= ordered.length) {
    return ordered;
  }

  [ordered[index], ordered[targetIndex]] = [ordered[targetIndex], ordered[index]];

  const now = new Date().toISOString();

  return ordered.map((layer, layerIndex) => ({
    ...layer,
    order: layerIndex,
    updatedAt: now,
  }));
}

export function normalizeMetric(metric?: Partial<PaperMetric> | null): PaperMetric {
  return {
    id: metric?.id?.trim() || createEntityId("metric"),
    name: metric?.name?.trim() || "",
    value: metric?.value?.trim() || "",
    unit: metric?.unit?.trim() || "",
    observation: metric?.observation?.trim() || "",
  };
}

export function normalizeMetricList(metrics?: Array<Partial<PaperMetric> | null>) {
  const normalized = (metrics ?? [])
    .map((metric) => normalizeMetric(metric))
    .filter((metric) => metric.name || metric.value || metric.unit || metric.observation);

  return normalized.length ? normalized : [createEmptyMetric()];
}

export function normalizeStructureNode(
  node?: Partial<PaperSectionNode> | null,
  fallbackLevel = 1,
): PaperSectionNode {
  const level =
    typeof node?.level === "number" && Number.isFinite(node.level) ? node.level : fallbackLevel;

  return {
    id: node?.id?.trim() || createEntityId("section"),
    title: node?.title?.trim() || "",
    level,
    notes: node?.notes?.trim() || "",
    highlight: Boolean(node?.highlight),
    children: (node?.children ?? []).map((child) => normalizeStructureNode(child, level + 1)),
  };
}

export function normalizeStructureTree(structure?: Array<Partial<PaperSectionNode> | null>) {
  const normalized = (structure ?? [])
    .map((node) => normalizeStructureNode(node))
    .filter((node) => node.title || node.notes || node.children.length > 0);

  return normalized.length ? normalized : [createEmptyStructureNode(1)];
}

export function normalizeProject(raw?: Partial<ResearchProject> | null): ResearchProject {
  const fallback = createEmptyProject();

  return {
    name: raw?.name?.trim() || fallback.name,
    description: raw?.description?.trim() || "",
    createdAt: raw?.createdAt || fallback.createdAt,
    updatedAt: raw?.updatedAt || fallback.updatedAt,
  };
}

export function normalizeSelectionEvaluation(
  raw?: Partial<PaperSelectionEvaluation> | null,
): PaperSelectionEvaluation {
  const fallback = createEmptySelectionEvaluation();

  const criteria = selectionCriteriaOptions.map((criterion) => {
    const source = raw?.criteria?.find((item) => item?.criterionKey === criterion.value);
    const numericScore = typeof source?.score === "number" ? source.score : 0;
    const boundedScore = Math.max(0, Math.min(5, Math.round(numericScore)));

    return {
      criterionKey: criterion.value,
      score: boundedScore,
      comment: source?.comment?.trim() || "",
    } satisfies PaperSelectionCriterionEvaluation;
  });

  const totalScore = criteria.reduce((sum, item) => sum + item.score, 0);
  const maxScore = selectionCriteriaOptions.length * 5;
  const decision = raw?.decision ?? fallback.decision;

  return {
    criteria,
    totalScore,
    maxScore,
    decision,
    overallComment: raw?.overallComment?.trim() || "",
    evaluatedAt:
      totalScore > 0 || decision || raw?.overallComment?.trim()
        ? raw?.evaluatedAt || new Date().toISOString()
        : raw?.evaluatedAt,
  };
}

export function normalizeSynthesisPromotion(
  raw?: Partial<ResearchPaper["synthesisPromotion"]> | null,
): ResearchPaper["synthesisPromotion"] {
  if (!raw?.promotedAt) {
    return null;
  }

  return {
    promotedAt: raw.promotedAt,
    justification: raw.justification?.trim() || "",
    sourceDecision: raw.sourceDecision ?? "promoted-to-synthesis",
  };
}

export function normalizeAnalyticalClassification(
  raw?: Partial<PaperAnalyticalClassification> | null,
): PaperAnalyticalClassification {
  const fallback = createEmptyAnalyticalClassification();

  return {
    role: raw?.role ?? fallback.role,
    note: raw?.note?.trim() || "",
    classifiedAt: raw?.role ? raw.classifiedAt || new Date().toISOString() : undefined,
  };
}

export function normalizeLayer(raw?: Partial<ResearchLayer> | null, index = 0): ResearchLayer {
  const fallback = createEmptyLayer(`Nueva capa ${index + 1}`, index);

  return {
    id: raw?.id?.trim() || fallback.id,
    name: raw?.name?.trim() || fallback.name,
    order: typeof raw?.order === "number" ? raw.order : index,
    description: raw?.description?.trim() || "",
    createdAt: raw?.createdAt || fallback.createdAt,
    updatedAt: raw?.updatedAt || fallback.updatedAt,
  };
}

export function normalizePaper(raw?: Partial<ResearchPaper> | null): ResearchPaper {
  const fallback = createEmptyPaper();
  const now = new Date().toISOString();

  const legacyMethod =
    typeof (raw as { method?: unknown } | undefined)?.method === "string"
      ? String((raw as { method?: string }).method).trim()
      : "";
  const legacyDataset =
    typeof (raw as { dataset?: unknown } | undefined)?.dataset === "string"
      ? String((raw as { dataset?: string }).dataset).trim()
      : "";
  const legacyPerformance =
    typeof (raw as { performance?: unknown } | undefined)?.performance === "string"
      ? String((raw as { performance?: string }).performance).trim()
      : "";
  const legacyLimitations =
    typeof (raw as { limitations?: unknown } | undefined)?.limitations === "string"
      ? String((raw as { limitations?: string }).limitations)
      : "";
  const legacyChallenges =
    typeof (raw as { futureChallenges?: unknown } | undefined)?.futureChallenges === "string"
      ? String((raw as { futureChallenges?: string }).futureChallenges)
      : "";

  return {
    id: raw?.id?.trim() || fallback.id,
    title: raw?.title?.trim() || "",
    authors: (raw?.authors ?? []).map((author) => String(author).trim()).filter(Boolean),
    year: typeof raw?.year === "number" ? raw.year : undefined,
    venue: raw?.venue?.trim() || "",
    doi: raw?.doi?.trim() || "",
    paperUrl: raw?.paperUrl?.trim() || "",
    pdfUrl: raw?.pdfUrl?.trim() || "",
    abstract: raw?.abstract?.trim() || "",
    personalSummary: raw?.personalSummary?.trim() || "",
    keywords: (raw?.keywords ?? []).map((keyword) => String(keyword).trim()).filter(Boolean),
    generalCategory: raw?.generalCategory?.trim() || "",
    subcategory: raw?.subcategory?.trim() || "",
    layerIds: Array.from(new Set((raw?.layerIds ?? []).map((id) => String(id).trim()).filter(Boolean))),
    objective: raw?.objective?.trim() || "",
    methods:
      raw?.methods?.map((method) => String(method).trim()).filter(Boolean) ??
      (legacyMethod ? [legacyMethod] : []),
    datasets:
      raw?.datasets?.map((dataset) => String(dataset).trim()).filter(Boolean) ??
      (legacyDataset ? [legacyDataset] : []),
    performanceMetrics:
      raw?.performanceMetrics && raw.performanceMetrics.length
        ? normalizeMetricList(raw.performanceMetrics)
        : legacyPerformance
          ? [
              normalizeMetric({
                name: "principal",
                value: legacyPerformance,
              }),
            ]
          : [createEmptyMetric()],
    limitations:
      raw?.limitations?.map((item) => String(item).trim()).filter(Boolean) ??
      (legacyLimitations ? [legacyLimitations] : [""]),
    futureChallenges:
      raw?.futureChallenges?.map((item) => String(item).trim()).filter(Boolean) ??
      (legacyChallenges ? [legacyChallenges] : [""]),
    researchUsefulness: raw?.researchUsefulness?.trim() || "",
    personalNotes: raw?.personalNotes?.trim() || "",
    structure: normalizeStructureTree(raw?.structure),
    readingStatus: raw?.readingStatus ?? fallback.readingStatus,
    priority: raw?.priority ?? fallback.priority,
    workflowStatus: raw?.workflowStatus ?? fallback.workflowStatus,
    selectionEvaluation: normalizeSelectionEvaluation(raw?.selectionEvaluation),
    synthesisPromotion: normalizeSynthesisPromotion(raw?.synthesisPromotion),
    analyticalClassification: normalizeAnalyticalClassification(raw?.analyticalClassification),
    createdAt: raw?.createdAt || fallback.createdAt || now,
    updatedAt: raw?.updatedAt || now,
  };
}

export function upsertPaper(
  papers: ResearchPaper[],
  paper: ResearchPaper,
): ResearchPaper[] {
  const now = new Date().toISOString();
  const normalizedPaper: ResearchPaper = {
    ...normalizePaper(paper),
    id: paper.id || createEntityId("paper"),
    updatedAt: now,
    createdAt: paper.createdAt || now,
  };

  const index = papers.findIndex((candidate) => candidate.id === normalizedPaper.id);

  if (index === -1) {
    return [normalizedPaper, ...papers];
  }

  return papers.map((candidate) =>
    candidate.id === normalizedPaper.id ? normalizedPaper : candidate,
  );
}

export function removePaperFromWorkspace(
  workspace: ResearchWorkspace,
  paperId: string,
): ResearchWorkspace {
  return {
    ...workspace,
    papers: workspace.papers.filter((paper) => paper.id !== paperId),
    relations: workspace.relations.filter(
      (relation) => relation.fromPaperId !== paperId && relation.toPaperId !== paperId,
    ),
  };
}

export function upsertRelation(
  relations: PaperRelation[],
  relation: PaperRelation,
) {
  const normalized: PaperRelation = {
    ...relation,
    id: relation.id || createEntityId("relation"),
  };

  const index = relations.findIndex((candidate) => candidate.id === normalized.id);

  if (index === -1) {
    return [normalized, ...relations];
  }

  return relations.map((candidate) =>
    candidate.id === normalized.id ? normalized : candidate,
  );
}

export function ensureWorkspaceShape(raw?: Partial<ResearchWorkspace> | null): ResearchWorkspace {
  const legacyName = (raw as { name?: string } | undefined)?.name;
  const legacyDescription = (raw as { description?: string } | undefined)?.description;

  const project = normalizeProject(
    raw?.project ?? {
      name: legacyName,
      description: legacyDescription,
      createdAt: raw?.createdAt,
      updatedAt: raw?.updatedAt,
    },
  );

  return {
    visibility: raw?.visibility === "link-readonly" ? "link-readonly" : "private",
    project,
    layers: sortLayers((raw?.layers ?? []).map((layer, index) => normalizeLayer(layer, index))),
    papers: (raw?.papers ?? []).map((paper) => normalizePaper(paper)),
    relations: raw?.relations ?? [],
    id: raw?.id,
    createdAt: raw?.createdAt || project.createdAt,
    updatedAt: raw?.updatedAt || project.updatedAt,
  };
}

export function createDraftPaperForLayer(layerId?: string) {
  return createEmptyPaper(layerId ? [layerId] : []);
}

export function workspaceHasPdf(paper: ResearchPaper) {
  return Boolean(paper.pdfUrl.trim());
}

export function getLayerNameById(layers: ResearchLayer[], layerId: string) {
  return layers.find((layer) => layer.id === layerId)?.name ?? "Sin capa";
}

export function flattenStructureTree(
  nodes: PaperSectionNode[],
  depth = 0,
): Array<PaperSectionNode & { depth: number }> {
  return nodes.flatMap((node) => [
    { ...node, depth },
    ...flattenStructureTree(node.children, depth + 1),
  ]);
}
