"use client";

import type { PaperPriority, PaperWorkflowStatus, ReadingStatus } from "@/lib/research/types";
import { ALL_COLUMNS, inputClassName } from "@/components/research/researchUiConfig";
import { workflowStatusLabels } from "@/features/papers-review/paper-management/workflowStatus";

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

type ResearchFiltersBarProps = {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  selectedYear: string;
  onSelectedYearChange: (value: string) => void;
  yearOptions: string[];
  selectedLayerId: string;
  onSelectedLayerIdChange: (value: string) => void;
  layerOptions: Array<{ id: string; name: string }>;
  selectedCategory: string;
  onSelectedCategoryChange: (value: string) => void;
  categoryOptions: string[];
  selectedPriority: PaperPriority | "";
  onSelectedPriorityChange: (value: PaperPriority | "") => void;
  selectedWorkflowStatus: PaperWorkflowStatus | "";
  onSelectedWorkflowStatusChange: (value: PaperWorkflowStatus | "") => void;
  selectedReadingStatus: ReadingStatus | "";
  onSelectedReadingStatusChange: (value: ReadingStatus | "") => void;
  onlyWithPdf: boolean;
  onOnlyWithPdfChange: (value: boolean) => void;
  viewMode: "cards" | "table" | "graph" | "selection";
  onViewModeChange: (value: "cards" | "table" | "graph" | "selection") => void;
  columnsOpen: boolean;
  onToggleColumnsOpen: () => void;
  visibleColumns: PaperVisibleColumn[];
  onToggleVisibleColumn: (column: PaperVisibleColumn) => void;
};

export default function ResearchFiltersBar({
  searchText,
  onSearchTextChange,
  selectedYear,
  onSelectedYearChange,
  yearOptions,
  selectedLayerId,
  onSelectedLayerIdChange,
  layerOptions,
  selectedCategory,
  onSelectedCategoryChange,
  categoryOptions,
  selectedPriority,
  onSelectedPriorityChange,
  selectedWorkflowStatus,
  onSelectedWorkflowStatusChange,
  selectedReadingStatus,
  onSelectedReadingStatusChange,
  onlyWithPdf,
  onOnlyWithPdfChange,
  viewMode,
  onViewModeChange,
  columnsOpen,
  onToggleColumnsOpen,
  visibleColumns,
  onToggleVisibleColumn,
}: ResearchFiltersBarProps) {
  return (
    <div className="z-10 flex h-9 shrink-0 items-center gap-2 border-b border-[var(--br)] bg-[var(--bg2)] px-3">
      <input
        className={`${inputClassName} w-52`}
        placeholder="buscar por título, autores, abstract, keywords..."
        value={searchText}
        onChange={(event) => onSearchTextChange(event.target.value)}
      />

      <select
        className={inputClassName}
        value={selectedYear}
        onChange={(event) => onSelectedYearChange(event.target.value)}
      >
        <option value="">Todos los años</option>
        {yearOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        className={inputClassName}
        value={selectedLayerId}
        onChange={(event) => onSelectedLayerIdChange(event.target.value)}
      >
        <option value="">Todas las capas</option>
        {layerOptions.map((layer) => (
          <option key={layer.id} value={layer.id}>
            {layer.name}
          </option>
        ))}
      </select>
      <select
        className={inputClassName}
        value={selectedCategory}
        onChange={(event) => onSelectedCategoryChange(event.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        className={inputClassName}
        value={selectedPriority}
        onChange={(event) => onSelectedPriorityChange(event.target.value as PaperPriority | "")}
      >
        <option value="">Toda prioridad</option>
        <option value="high">alta</option>
        <option value="medium">media</option>
        <option value="low">baja</option>
      </select>
      <select
        className={inputClassName}
        value={selectedWorkflowStatus}
        onChange={(event) =>
          onSelectedWorkflowStatusChange(event.target.value as PaperWorkflowStatus | "")
        }
      >
        <option value="">Toda fase</option>
        {Object.entries(workflowStatusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        className={inputClassName}
        value={selectedReadingStatus}
        onChange={(event) =>
          onSelectedReadingStatusChange(event.target.value as ReadingStatus | "")
        }
      >
        <option value="">Todo estado</option>
        <option value="unread">pendiente</option>
        <option value="partial">leyendo</option>
        <option value="read">leído</option>
      </select>
      <label className="flex items-center gap-1 text-[11px] text-[var(--tx3)]">
        <input
          type="checkbox"
          checked={onlyWithPdf}
          onChange={(event) => onOnlyWithPdfChange(event.target.checked)}
        />
        solo PDF
      </label>

      <div className="flex-1" />

      <div className="flex overflow-hidden rounded border border-[var(--br)]">
        <button
          type="button"
          className={`px-3 py-1 text-[11px] transition-colors ${
            viewMode === "cards"
              ? "bg-[var(--tx)] text-[var(--bg2)]"
              : "bg-[var(--bg2)] text-[var(--tx3)] hover:bg-[var(--bg3)]"
          }`}
          onClick={() => onViewModeChange("cards")}
        >
          tarjetas
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-[11px] transition-colors ${
            viewMode === "table"
              ? "bg-[var(--tx)] text-[var(--bg2)]"
              : "bg-[var(--bg2)] text-[var(--tx3)] hover:bg-[var(--bg3)]"
          }`}
          onClick={() => onViewModeChange("table")}
        >
          tabla comparativa
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-[11px] transition-colors ${
            viewMode === "graph"
              ? "bg-[var(--tx)] text-[var(--bg2)]"
              : "bg-[var(--bg2)] text-[var(--tx3)] hover:bg-[var(--bg3)]"
          }`}
          onClick={() => onViewModeChange("graph")}
        >
          grafo
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-[11px] transition-colors ${
            viewMode === "selection"
              ? "bg-[var(--tx)] text-[var(--bg2)]"
              : "bg-[var(--bg2)] text-[var(--tx3)] hover:bg-[var(--bg3)]"
          }`}
          onClick={() => onViewModeChange("selection")}
        >
          matriz
        </button>
      </div>

      <div className="relative">
        <button type="button" className={inputClassName} onClick={onToggleColumnsOpen}>
          cols ⊞
        </button>
        {columnsOpen ? (
          <div className="absolute right-0 top-8 z-50 min-w-[180px] border border-[var(--br)] bg-[var(--bg2)] p-3 shadow-lg">
            <p className="mb-2 text-[10px] uppercase tracking-wide text-[var(--tx4)]">
              columnas visibles
            </p>
            {ALL_COLUMNS.map((column) => (
              <label
                key={column.key}
                className="flex cursor-pointer items-center gap-2 py-0.5 text-[11px] text-[var(--tx2)] hover:text-[var(--tx)]"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column.key)}
                  onChange={() => onToggleVisibleColumn(column.key)}
                />
                {column.label}
              </label>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
