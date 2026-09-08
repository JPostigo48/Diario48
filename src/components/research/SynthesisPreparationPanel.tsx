"use client";

import { useState } from "react";
import { analyticalRoleOptions } from "@/lib/research/defaults";
import type { ResearchPaper } from "@/lib/research/types";
import {
  analyticalRoleLabels,
  buildSynthesisPreparationReport,
  plannedSemanticHandlers,
} from "@/features/papers-review/paper-management/synthesisPreparation";

type SynthesisPreparationPanelProps = {
  paper: ResearchPaper;
  onSaveAnalyticalClassification: (
    analyticalClassification: ResearchPaper["analyticalClassification"],
  ) => void;
};

export default function SynthesisPreparationPanel({
  paper,
  onSaveAnalyticalClassification,
}: SynthesisPreparationPanelProps) {
  const report = buildSynthesisPreparationReport(paper);
  const [role, setRole] = useState<ResearchPaper["analyticalClassification"]["role"]>(
    paper.analyticalClassification.role,
  );
  const [note, setNote] = useState(paper.analyticalClassification.note);

  return (
    <div className="rounded border border-[var(--br)] bg-[var(--bg3)] p-3">
      <div className="mb-3">
        <p className="text-[9px] uppercase tracking-wider text-[var(--tx4)]">
          preparación para síntesis y clasificación
        </p>
        <p className="mt-1 text-[11px] text-[var(--tx3)]">
          separa explícitamente qué pertenece a selección, síntesis futura y rol analítico.
        </p>
      </div>

      <div className="mb-3 grid gap-2 md:grid-cols-2">
        <StatusCard
          label="listo para iniciar síntesis"
          value={report.readyToStartSynthesis ? "sí" : "todavía no"}
        />
        <StatusCard
          label="síntesis con datos mínimos"
          value={report.readyForSynthesis ? "sí" : "faltan datos"}
        />
      </div>

      <SectionList
        title="campos que deberían migrar a la futura ficha de síntesis"
        items={report.futureSynthesisFields.map((field) => field.label)}
      />
      <SectionList
        title="campos actualmente mezclados y que conviene mover después"
        items={report.mixedFields.map((field) => field.label)}
      />
      <SectionList
        title="faltantes detectados para una futura síntesis técnica"
        items={report.missingFields.map((field) => field.label)}
        emptyMessage="sin faltantes evidentes en esta revisión mínima"
      />

      <div className="mt-3 rounded border border-[var(--br)] bg-[var(--bg)] p-3">
        <p className="mb-2 text-[9px] uppercase tracking-wider text-[var(--tx4)]">
          extensión preparada para clasificación analítica
        </p>
        {paper.analyticalClassification.role ? (
          <p className="mb-2 text-[11px] text-[var(--tx2)]">
            rol actual: {analyticalRoleLabels[paper.analyticalClassification.role]}
          </p>
        ) : null}
        <div className="grid gap-2 md:grid-cols-[220px_minmax(0,1fr)]">
          <select
            value={role ?? ""}
            onChange={(event) =>
              setRole((event.target.value || null) as ResearchPaper["analyticalClassification"]["role"])
            }
            className="rounded border border-[var(--br)] bg-[var(--bg2)] px-2 py-1.5 text-[11px] text-[var(--tx)] outline-none"
          >
            <option value="">Sin rol analítico</option>
            {analyticalRoleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={2}
            className="w-full rounded border border-[var(--br)] bg-[var(--bg2)] px-2 py-1.5 text-[11px] text-[var(--tx)] outline-none"
            placeholder="por qué este paper cumple ese rol"
          />
        </div>
        <button
          type="button"
          className="mt-2 rounded border border-[var(--br)] bg-[var(--bg2)] px-3 py-1.5 text-[11px] text-[var(--tx2)]"
          onClick={() =>
            onSaveAnalyticalClassification({
              role,
              note,
              classifiedAt: role ? new Date().toISOString() : undefined,
            })
          }
        >
          guardar clasificación analítica
        </button>
      </div>

      <SectionList
        title="handlers semánticos que conviene exponer en sprint 03"
        items={plannedSemanticHandlers.map((handler) => handler)}
      />
    </div>
  );
}

function SectionList({
  title,
  items,
  emptyMessage = "sin elementos por ahora",
}: {
  title: string;
  items: string[];
  emptyMessage?: string;
}) {
  return (
    <div className="mt-3 rounded border border-[var(--br)] bg-[var(--bg)] p-3">
      <p className="mb-2 text-[9px] uppercase tracking-wider text-[var(--tx4)]">{title}</p>
      {items.length ? (
        <ul className="list-disc pl-4 text-[11px] text-[var(--tx2)]">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-[11px] text-[var(--tx3)]">{emptyMessage}</p>
      )}
    </div>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[var(--br)] bg-[var(--bg)] p-3">
      <p className="text-[9px] uppercase tracking-wider text-[var(--tx4)]">{label}</p>
      <p className="mt-1 text-[11px] font-medium text-[var(--tx)]">{value}</p>
    </div>
  );
}
