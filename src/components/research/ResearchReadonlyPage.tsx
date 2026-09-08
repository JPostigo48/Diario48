"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useThemeMode } from "@/components/ui/useThemeMode";
import type { ResearchPaper, ResearchWorkspace } from "@/lib/research/types";
import { getLayerNameById, workspaceHasPdf } from "@/lib/research/utils";

type ResearchReadonlyPageProps = {
  workspace: ResearchWorkspace;
};

export default function ResearchReadonlyPage({ workspace }: ResearchReadonlyPageProps) {
  const { theme, toggleTheme } = useThemeMode();
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(
    workspace.papers[0]?.id ?? null,
  );

  const selectedPaper = useMemo(
    () => workspace.papers.find((paper) => paper.id === selectedPaperId) ?? null,
    [selectedPaperId, workspace.papers],
  );

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[var(--bg)] font-mono text-xs text-[var(--tx)]">
      <header className="flex items-center justify-between border-b border-[var(--br)] bg-[var(--bg2)] px-4 py-3">
        <div>
          <Link href="/" className="font-mono text-[17px] font-bold no-underline">
            Diario<span className="text-[var(--acc)]">48</span>
          </Link>
          <div className="mt-1 text-[11px] text-[var(--tx3)]">
            papers review · viewer readonly
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded border border-[var(--br)] bg-[var(--bg3)] px-2 py-1 text-[10px] text-[var(--tx3)]">
            {workspace.visibility === "link-readonly" ? "link-readonly" : "private"}
          </span>
          <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <section className="border-b border-[var(--br)] bg-[var(--bg2)] px-4 py-3">
        <p className="text-[10px] uppercase tracking-wide text-[var(--tx4)]">{"// workspace compartido"}</p>
        <h1 className="mt-1 text-[18px] font-semibold text-[var(--tx)]">
          {workspace.project.name}
        </h1>
        <p className="mt-2 max-w-[760px] text-[12px] leading-relaxed text-[var(--tx3)]">
          {workspace.project.description || "Sin descripción registrada."}
        </p>
        <div className="mt-3 text-[11px] text-[var(--tx4)]">
          {workspace.papers.length} papers · {workspace.layers.length} capas · {workspace.relations.length} relaciones
        </div>
      </section>

      <section className="grid min-h-0 flex-1 grid-cols-[360px_1fr_360px] overflow-hidden">
        <aside className="d48-scrollbar overflow-y-auto border-r border-[var(--br)] bg-[var(--bg2)] p-3">
          <div className="mb-3 text-[10px] uppercase tracking-wide text-[var(--tx4)]">
            papers del workspace
          </div>

          {workspace.papers.length ? (
            workspace.papers.map((paper) => (
              <button
                key={paper.id}
                type="button"
                onClick={() => setSelectedPaperId(paper.id)}
                className={`mb-2 w-full rounded border p-3 text-left transition-colors ${
                  selectedPaperId === paper.id
                    ? "border-[var(--acc3)] bg-[var(--acc2)]"
                    : "border-[var(--br)] bg-[var(--bg3)] hover:bg-[var(--bg)]"
                }`}
              >
                <div className="text-[12px] font-semibold leading-snug text-[var(--tx)]">
                  {paper.title}
                </div>
                <div className="mt-1 text-[10px] text-[var(--tx4)]">
                  {paper.authors.join(", ") || "Autores sin registrar"} · {paper.year || "—"}
                </div>
                <div className="mt-2 text-[10px] text-[var(--tx3)]">
                  {paper.layerIds[0] ? getLayerNameById(workspace.layers, paper.layerIds[0]) : "Sin capa"}
                </div>
              </button>
            ))
          ) : (
            <div className="rounded border border-dashed border-[var(--br2)] bg-[var(--bg3)] px-3 py-4 text-[12px] text-[var(--tx3)]">
              Este workspace todavía no tiene papers.
            </div>
          )}
        </aside>

        <div className="flex min-h-0 flex-col overflow-hidden bg-[var(--bg)]">
          <div className="flex h-8 shrink-0 items-center gap-2 border-b border-[var(--br)] bg-[var(--bg2)] px-3">
            <p className="text-[10px] uppercase tracking-wider text-[var(--tx4)]">{"// visor PDF"}</p>
            <div className="flex-1" />
            {selectedPaper?.pdfUrl ? (
              <a href={selectedPaper.pdfUrl} target="_blank" rel="noreferrer" className="rounded border border-[var(--br)] px-2 py-1 text-[10px] text-[var(--tx2)] hover:bg-[var(--bg3)]">
                abrir en pestaña ↗
              </a>
            ) : null}
          </div>
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            {selectedPaper?.pdfUrl ? (
              <iframe src={selectedPaper.pdfUrl} className="h-full w-full border-0" title="PDF viewer" />
            ) : (
              <div className="text-center text-[var(--tx4)]">
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

        <aside className="d48-scrollbar overflow-y-auto border-l border-[var(--br)] bg-[var(--bg2)] p-4">
          {!selectedPaper ? (
            <p className="text-[12px] text-[var(--tx3)]">
              Selecciona un paper para ver su detalle.
            </p>
          ) : (
            <ResearchPaperReadonlyInspector paper={selectedPaper} workspace={workspace} />
          )}
        </aside>
      </section>
    </main>
  );
}

function ResearchPaperReadonlyInspector({
  paper,
  workspace,
}: {
  paper: ResearchPaper;
  workspace: ResearchWorkspace;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--tx4)]">{"// detalle"}</div>
      <h2 className="mt-2 text-[15px] font-semibold leading-snug text-[var(--tx)]">{paper.title}</h2>
      <p className="mt-1 text-[11px] text-[var(--tx3)]">
        {paper.authors.join(", ") || "Autores sin registrar"} · {paper.year || "—"}
        {paper.venue ? ` · ${paper.venue}` : ""}
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2">
        {[
          { label: "capa", value: paper.layerIds[0] ? getLayerNameById(workspace.layers, paper.layerIds[0]) : "—" },
          { label: "subcategoría", value: paper.subcategory || "—" },
          { label: "categoría", value: paper.generalCategory || "—" },
          { label: "prioridad", value: paper.priority },
          { label: "estado", value: paper.readingStatus },
          { label: "dataset", value: paper.datasets[0] || "—" },
          { label: "método", value: paper.methods[0] || "—" },
          { label: "alineación", value: paper.researchUsefulness || "—" },
          { label: "pdf", value: workspaceHasPdf(paper) ? "sí" : "no" },
        ].map((item) => (
          <div key={item.label}>
            <p className="mb-0.5 text-[9px] uppercase tracking-wider text-[var(--tx4)]">{item.label}</p>
            <p className="border-b border-[var(--br)] pb-0.5 text-[11px] text-[var(--tx2)]">{item.value}</p>
          </div>
        ))}
      </div>

      {paper.abstract ? (
        <div className="mt-4 border-t border-[var(--br)] pt-3">
          <p className="mb-1 text-[9px] uppercase tracking-wider text-[var(--tx4)]">abstract</p>
          <p className="text-[11px] leading-relaxed text-[var(--tx2)]">{paper.abstract}</p>
        </div>
      ) : null}

      {paper.personalSummary ? (
        <div className="mt-4 border-t border-[var(--br)] pt-3">
          <p className="mb-1 text-[9px] uppercase tracking-wider text-[var(--tx4)]">resumen</p>
          <p className="text-[11px] leading-relaxed text-[var(--tx2)]">{paper.personalSummary}</p>
        </div>
      ) : null}

      {paper.personalNotes ? (
        <div className="mt-4 border-t border-[var(--br)] pt-3">
          <p className="mb-1 text-[9px] uppercase tracking-wider text-[var(--tx4)]">notas</p>
          <p className="text-[11px] leading-relaxed text-[var(--tx2)]">{paper.personalNotes}</p>
        </div>
      ) : null}
    </div>
  );
}
