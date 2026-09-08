"use client";

import {
  getSelectionCriterionLabel,
  hasSelectionEvaluation,
  selectionDecisionLabels,
} from "@/features/papers-review/paper-management/selectionMatrix";
import { workflowStatusLabels } from "@/features/papers-review/paper-management/workflowStatus";
import type { ResearchPaper } from "@/lib/research/types";

type ResearchSelectionMatrixViewProps = {
  papers: ResearchPaper[];
  selectedPaperId: string | null;
  onSelectPaper: (paperId: string) => void;
};

export default function ResearchSelectionMatrixView({
  papers,
  selectedPaperId,
  onSelectPaper,
}: ResearchSelectionMatrixViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[10px]">
        <thead>
          <tr className="border-b border-[var(--br)]">
            <th className="px-2 py-1.5 text-left font-normal text-[var(--tx4)]">paper</th>
            {papers[0]?.selectionEvaluation.criteria.map((criterion) => (
              <th
                key={criterion.criterionKey}
                className="whitespace-nowrap px-2 py-1.5 text-left font-normal text-[var(--tx4)]"
              >
                {getSelectionCriterionLabel(criterion.criterionKey)}
              </th>
            ))}
            <th className="px-2 py-1.5 text-left font-normal text-[var(--tx4)]">score</th>
            <th className="px-2 py-1.5 text-left font-normal text-[var(--tx4)]">decisión</th>
            <th className="px-2 py-1.5 text-left font-normal text-[var(--tx4)]">fase</th>
          </tr>
        </thead>
        <tbody>
          {papers.map((paper) => (
            <tr
              key={paper.id}
              onClick={() => onSelectPaper(paper.id)}
              className={`cursor-pointer border-b border-[var(--br)] hover:bg-[var(--bg3)] ${
                selectedPaperId === paper.id ? "bg-[var(--bg3)]" : ""
              }`}
            >
              <td className="max-w-[260px] px-2 py-1.5 text-[var(--tx2)]">
                <div className="font-semibold text-[var(--tx)]">{paper.title}</div>
                <div className="mt-0.5 text-[10px] text-[var(--tx4)]">
                  {hasSelectionEvaluation(paper)
                    ? paper.selectionEvaluation.overallComment || "evaluado"
                    : "sin evaluación"}
                </div>
              </td>
              {paper.selectionEvaluation.criteria.map((criterion) => (
                <td key={criterion.criterionKey} className="px-2 py-1.5 text-[var(--tx2)]">
                  {criterion.score}/5
                </td>
              ))}
              <td className="px-2 py-1.5 text-[var(--tx2)]">
                {paper.selectionEvaluation.totalScore}/{paper.selectionEvaluation.maxScore}
              </td>
              <td className="px-2 py-1.5 text-[var(--tx2)]">
                {paper.selectionEvaluation.decision
                  ? selectionDecisionLabels[paper.selectionEvaluation.decision]
                  : "—"}
              </td>
              <td className="px-2 py-1.5 text-[var(--tx2)]">
                {workflowStatusLabels[paper.workflowStatus]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
