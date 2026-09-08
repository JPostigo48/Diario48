"use client";

import type {
  PaperPriority,
  ReadingStatus,
  ResearchLayer,
  ResearchPaper,
} from "@/lib/research/types";

export type PaperVisibleColumn =
  | "title"
  | "year"
  | "venue"
  | "dataset"
  | "method"
  | "performance"
  | "limitations"
  | "researchUsefulness"
  | "priority"
  | "readingStatus";

type ResearchToolbarProps = {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  selectedLayerId: string;
  onLayerChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedPriority: string;
  onPriorityChange: (value: PaperPriority | "") => void;
  selectedReadingStatus: string;
  onReadingStatusChange: (value: ReadingStatus | "") => void;
  onlyWithPdf: boolean;
  onOnlyWithPdfChange: (value: boolean) => void;
  viewMode: "cards" | "table";
  onViewModeChange: (value: "cards" | "table") => void;
  layers: ResearchLayer[];
  papers: ResearchPaper[];
  visibleColumns: PaperVisibleColumn[];
  onToggleColumn: (column: PaperVisibleColumn) => void;
  onCreatePaper: () => void;
  onCreateRelation: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onDownloadTemplateJson: () => void;
};

const allColumns: Array<{ value: PaperVisibleColumn; label: string }> = [
  { value: "title", label: "Título" },
  { value: "year", label: "Año" },
  { value: "venue", label: "Venue" },
  { value: "dataset", label: "Dataset" },
  { value: "method", label: "Método" },
  { value: "performance", label: "Performance" },
  { value: "limitations", label: "Limitaciones" },
  { value: "researchUsefulness", label: "Alineación" },
  { value: "priority", label: "Prioridad" },
  { value: "readingStatus", label: "Lectura" },
];

export default function ResearchToolbar({
  searchText,
  onSearchTextChange,
  selectedYear,
  onYearChange,
  selectedLayerId,
  onLayerChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  selectedReadingStatus,
  onReadingStatusChange,
  onlyWithPdf,
  onOnlyWithPdfChange,
  viewMode,
  onViewModeChange,
  layers,
  papers,
  visibleColumns,
  onToggleColumn,
  onCreatePaper,
  onCreateRelation,
  onExportJson,
  onImportJson,
  onDownloadTemplateJson,
}: ResearchToolbarProps) {
  const years = Array.from(
    new Set(
      papers
        .map((paper) => paper.year)
        .filter((year): year is number => typeof year === "number"),
    ),
  ).sort((a, b) => b - a);

  const categories = Array.from(
    new Set(papers.map((paper) => paper.generalCategory).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="border-b border-[var(--br)] bg-[var(--bg2)] px-5 py-4">
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={onDownloadTemplateJson}
          className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-4 py-2 font-mono text-[11px] text-[var(--tx2)]"
        >
          plantilla JSON
        </button>
        <button
          type="button"
          onClick={onCreatePaper}
          className="rounded-[12px] border border-[var(--acc3)] bg-[var(--acc2)] px-4 py-2 font-mono text-[11px] font-semibold text-[var(--tx)]"
        >
          agregar paper
        </button>
        <button
          type="button"
          onClick={onCreateRelation}
          className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-4 py-2 font-mono text-[11px] text-[var(--tx2)]"
        >
          nueva relación
        </button>
        <button
          type="button"
          onClick={onImportJson}
          className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-4 py-2 font-mono text-[11px] text-[var(--tx2)]"
        >
          importar JSON
        </button>
        <button
          type="button"
          onClick={onExportJson}
          className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-4 py-2 font-mono text-[11px] text-[var(--tx2)]"
        >
          exportar JSON
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[2fr_repeat(6,minmax(0,1fr))]">
        <input
          value={searchText}
          onChange={(event) => onSearchTextChange(event.target.value)}
          className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[13px] text-[var(--tx)] outline-none"
          placeholder="Buscar por título, autores, abstract, keywords, notas..."
        />

        <select
          value={selectedYear}
          onChange={(event) => onYearChange(event.target.value)}
          className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[13px] text-[var(--tx)] outline-none"
        >
          <option value="">Todos los años</option>
          {years.map((year) => (
            <option key={year} value={String(year)}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={selectedLayerId}
          onChange={(event) => onLayerChange(event.target.value)}
          className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[13px] text-[var(--tx)] outline-none"
        >
          <option value="">Todas las capas</option>
          {layers.map((layer) => (
            <option key={layer.id} value={layer.id}>
              {layer.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[13px] text-[var(--tx)] outline-none"
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={selectedPriority}
          onChange={(event) => onPriorityChange(event.target.value as PaperPriority | "")}
          className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[13px] text-[var(--tx)] outline-none"
        >
          <option value="">Toda prioridad</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>

        <select
          value={selectedReadingStatus}
          onChange={(event) => onReadingStatusChange(event.target.value as ReadingStatus | "")}
          className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[13px] text-[var(--tx)] outline-none"
        >
          <option value="">Todo estado</option>
          <option value="unread">No leído</option>
          <option value="partial">Leído parcialmente</option>
          <option value="read">Leído</option>
        </select>

        <label className="flex items-center justify-center gap-2 rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[12px] text-[var(--tx2)]">
          <input
            type="checkbox"
            checked={onlyWithPdf}
            onChange={(event) => onOnlyWithPdfChange(event.target.checked)}
          />
          solo con PDF
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            className="rounded-[10px] px-3 py-2 font-mono text-[11px]"
            style={{
              backgroundColor: viewMode === "cards" ? "var(--acc2)" : "transparent",
              color: viewMode === "cards" ? "var(--tx)" : "var(--tx3)",
            }}
          >
            tarjetas
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className="rounded-[10px] px-3 py-2 font-mono text-[11px]"
            style={{
              backgroundColor: viewMode === "table" ? "var(--acc2)" : "transparent",
              color: viewMode === "table" ? "var(--tx)" : "var(--tx3)",
            }}
          >
            tabla comparativa
          </button>
        </div>

        <div className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--tx3)]">
            columnas visibles
          </div>
          <div className="flex flex-wrap gap-2">
            {allColumns.map((column) => (
              <label
                key={column.value}
                className="inline-flex items-center gap-1.5 rounded-[999px] border border-[var(--br)] px-2 py-1 text-[11px] text-[var(--tx2)]"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column.value)}
                  onChange={() => onToggleColumn(column.value)}
                />
                {column.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
