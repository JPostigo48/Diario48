import type { PaperVisibleColumn } from "@/components/research/ResearchFiltersBar";
import { priorityLabels, readingStatusLabels } from "@/components/research/researchUiConfig";
import type { ResearchPaper } from "@/lib/research/types";

export function getPrimaryMethod(paper: ResearchPaper) {
  return paper.methods[0] || "—";
}

export function getPrimaryDataset(paper: ResearchPaper) {
  return paper.datasets[0] || "—";
}

export function getPrimaryPerformance(paper: ResearchPaper) {
  const metric = paper.performanceMetrics.find(
    (item) => item.name || item.value || item.unit || item.observation,
  );

  if (!metric) {
    return "—";
  }

  return [metric.name, metric.value, metric.unit].filter(Boolean).join(": ").replace(": :", ": ");
}

export function formatListSummary(items: string[]) {
  return items.length ? items.join(" · ") : "—";
}

export function renderTableValue(paper: ResearchPaper, column: PaperVisibleColumn) {
  switch (column) {
    case "title":
      return <span className="font-bold">{paper.title}</span>;
    case "year":
      return paper.year || "—";
    case "venue":
      return paper.venue || "—";
    case "dataset":
      return getPrimaryDataset(paper);
    case "method":
      return getPrimaryMethod(paper);
    case "performance":
      return getPrimaryPerformance(paper);
    case "limitations":
      return formatListSummary(paper.limitations);
    case "researchUsefulness":
      return paper.researchUsefulness || "—";
    case "priority":
      return priorityLabels[paper.priority];
    case "readingStatus":
      return readingStatusLabels[paper.readingStatus];
    default:
      return "—";
  }
}
