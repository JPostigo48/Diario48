import type { PaperRelation, ResearchPaper } from "@/lib/research/types";

export function buildResearchGraphData(papers: ResearchPaper[], relations: PaperRelation[]) {
  const visiblePapers = papers.slice(0, 120);
  const visibleIds = new Set(visiblePapers.map((paper) => paper.id));

  const explicitEdges = relations
    .filter((relation) => visibleIds.has(relation.fromPaperId) && visibleIds.has(relation.toPaperId))
    .map((relation) => ({
      id: relation.id,
      source: relation.fromPaperId,
      target: relation.toPaperId,
      label: relation.type,
      inferred: false,
      weight: 10,
    }));

  const pairSeen = new Set(explicitEdges.map((edge) => [edge.source, edge.target].sort().join("::")));
  const inferredEdges: Array<{ id: string; source: string; target: string; label: string; inferred: boolean; weight: number }> = [];

  for (let index = 0; index < visiblePapers.length; index += 1) {
    const current = visiblePapers[index];
    for (let offset = index + 1; offset < visiblePapers.length; offset += 1) {
      const candidate = visiblePapers[offset];
      const pairKey = [current.id, candidate.id].sort().join("::");
      if (pairSeen.has(pairKey)) continue;

      const sharedLayers = current.layerIds.filter((layerId) => candidate.layerIds.includes(layerId));
      const sameCategory = current.generalCategory && candidate.generalCategory && current.generalCategory === candidate.generalCategory;
      const sharedKeywords = current.keywords.filter((keyword) => candidate.keywords.some((candidateKeyword) => candidateKeyword.trim().toLowerCase() === keyword.trim().toLowerCase()));
      const sharedDatasets = current.datasets.filter((dataset) => candidate.datasets.some((candidateDataset) => candidateDataset.trim().toLowerCase() === dataset.trim().toLowerCase()));
      const sharedMethods = current.methods.filter((method) => candidate.methods.some((candidateMethod) => candidateMethod.trim().toLowerCase() === method.trim().toLowerCase()));

      const weight = sharedLayers.length * 4 + (sameCategory ? 3 : 0) + sharedKeywords.length * 2 + sharedDatasets.length * 2 + sharedMethods.length;
      if (weight <= 0) continue;

      const labels: string[] = [];
      if (sharedLayers.length) labels.push("capa");
      if (sameCategory) labels.push("categoría");
      if (sharedKeywords.length) labels.push("keywords");
      if (sharedDatasets.length) labels.push("dataset");
      if (sharedMethods.length) labels.push("método");

      inferredEdges.push({ id: `inferred_${pairKey}`, source: current.id, target: candidate.id, label: labels.slice(0, 2).join(" + "), inferred: true, weight });
      pairSeen.add(pairKey);
    }
  }

  inferredEdges.sort((left, right) => right.weight - left.weight);

  return {
    visiblePapers,
    edges: [...explicitEdges, ...inferredEdges.slice(0, 260)],
  };
}
