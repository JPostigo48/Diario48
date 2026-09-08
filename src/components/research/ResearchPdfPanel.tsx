"use client";

import { smallButtonClassName } from "@/components/research/researchUiConfig";
import type { ResearchPaper } from "@/lib/research/types";

type ResearchPdfPanelProps = {
  selectedPaper: ResearchPaper | null;
};

export default function ResearchPdfPanel({ selectedPaper }: ResearchPdfPanelProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[var(--bg)]">
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-[var(--br)] bg-[var(--bg2)] px-3">
        <p className="text-[10px] uppercase tracking-wider text-[var(--tx4)]">{"// visor PDF"}</p>
        <div className="flex-1" />
        {selectedPaper?.pdfUrl ? (
          <a href={selectedPaper.pdfUrl} target="_blank" rel="noreferrer" className={smallButtonClassName}>
            abrir en pestaña ↗
          </a>
        ) : null}
      </div>
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        {selectedPaper?.pdfUrl ? (
          <iframe src={selectedPaper.pdfUrl} className="h-full w-full border-0" title="PDF viewer" />
        ) : (
          <div className="text-center text-[var(--tx4)]">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mx-auto"
            >
              <rect x="4" y="2" width="12" height="18" rx="2" />
              <path d="M8 7h6M8 11h6M8 15h4" />
              <path d="M14 2v4h4" />
            </svg>
            <p className="mt-2 text-[11px]">
              {!selectedPaper
                ? "selecciona un paper para ver su PDF"
                : !selectedPaper.pdfUrl
                  ? "este paper no tiene PDF registrado"
                  : "cargando PDF..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
