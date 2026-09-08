"use client";

import { useState } from "react";
import { isReadyForSynthesisPromotion } from "@/features/papers-review/paper-management/selectionMatrix";
import type { ResearchPaper } from "@/lib/research/types";

type SynthesisPromotionPanelProps = {
  paper: ResearchPaper;
  onPromote: (justification: string) => void;
};

export default function SynthesisPromotionPanel({
  paper,
  onPromote,
}: SynthesisPromotionPanelProps) {
  const [justification, setJustification] = useState(
    paper.synthesisPromotion?.justification ?? paper.selectionEvaluation.overallComment ?? "",
  );

  if (paper.synthesisPromotion) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 p-3">
        <p className="text-[9px] uppercase tracking-wider text-amber-700">
          promoción a síntesis registrada
        </p>
        <p className="mt-2 text-[11px] text-amber-900">
          Promovido el {new Date(paper.synthesisPromotion.promotedAt).toLocaleString()}.
        </p>
        <p className="mt-2 text-[11px] text-amber-800">
          {paper.synthesisPromotion.justification || "sin justificación registrada"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded border border-[var(--br)] bg-[var(--bg3)] p-3">
      <p className="text-[9px] uppercase tracking-wider text-[var(--tx4)]">
        promoción a síntesis
      </p>
      <p className="mt-1 text-[11px] text-[var(--tx3)]">
        cruza explícitamente la frontera entre paper evaluado y paper promovido.
      </p>

      {!isReadyForSynthesisPromotion(paper) ? (
        <p className="mt-3 text-[11px] text-[var(--tx3)]">
          Este paper todavía no está listo: necesita una evaluación previa con decisión final
          compatible.
        </p>
      ) : (
        <>
          <textarea
            value={justification}
            onChange={(event) => setJustification(event.target.value)}
            rows={3}
            className="mt-3 w-full rounded border border-[var(--br)] bg-[var(--bg)] px-2 py-1.5 text-[11px] text-[var(--tx)] outline-none"
            placeholder="justifica por qué este paper debe pasar a síntesis"
          />
          <button
            type="button"
            className="mt-3 rounded border border-amber-300 bg-amber-100 px-3 py-2 text-[11px] text-amber-900"
            onClick={() => onPromote(justification)}
          >
            promover a síntesis
          </button>
        </>
      )}
    </div>
  );
}
