import type { PaperPriority, ReadingStatus } from "@/lib/research/types";
import type { PaperVisibleColumn } from "@/components/research/ResearchFiltersBar";

export const ALL_COLUMNS: Array<{ key: PaperVisibleColumn; label: string }> = [
  { key: "title", label: "Título" },
  { key: "year", label: "Año" },
  { key: "venue", label: "Venue" },
  { key: "dataset", label: "Dataset" },
  { key: "method", label: "Método" },
  { key: "performance", label: "Performance" },
  { key: "limitations", label: "Limitaciones" },
  { key: "researchUsefulness", label: "Alineación" },
  { key: "priority", label: "Prioridad" },
  { key: "readingStatus", label: "Estado" },
];

export const DEFAULT_VISIBLE: PaperVisibleColumn[] = [
  "title",
  "year",
  "dataset",
  "method",
  "performance",
  "limitations",
  "researchUsefulness",
  "readingStatus",
];

export const readingStatusLabels: Record<ReadingStatus, string> = {
  unread: "pendiente",
  partial: "leyendo",
  read: "leído",
};

export const priorityLabels: Record<PaperPriority, string> = {
  high: "alta",
  medium: "media",
  low: "baja",
};

export const tagClassNames: Record<string, string> = {
  layer: "bg-[var(--bg3)] text-[var(--tx2)]",
  category: "bg-[var(--acc2)] text-[var(--acc)]",
  alta: "bg-amber-50 text-amber-700",
  media: "bg-[var(--bg3)] text-[var(--tx2)]",
  baja: "bg-[var(--bg)] text-[var(--tx4)]",
  leído: "bg-green-50 text-green-700",
  leyendo: "bg-blue-50 text-blue-600",
  pendiente: "bg-[var(--bg3)] text-[var(--tx3)]",
  nopdf: "bg-red-50 text-red-500",
};

export const inputClassName =
  "rounded border border-[var(--br)] bg-[var(--bg)] px-2 py-1 text-[11px] text-[var(--tx)] outline-none focus:border-[var(--tx3)] focus:bg-[var(--bg2)]";

export const smallButtonClassName =
  "rounded border border-[var(--br)] px-2 py-1 text-[10px] text-[var(--tx2)] transition-colors hover:bg-[var(--bg3)]";

export const primarySmallButtonClassName =
  "rounded border border-[var(--acc3)] bg-[var(--acc2)] px-2 py-1 text-[10px] text-[var(--tx)] transition-colors hover:opacity-90";
