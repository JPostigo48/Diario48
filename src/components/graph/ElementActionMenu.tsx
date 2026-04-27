"use client";

import type { GraphTheme } from "@/lib/graph/theme";
import type { GraphEdge, GraphNode, SelectedGraphElement } from "@/lib/graph/types";

type ElementActionMenuProps = {
  theme: GraphTheme;
  selectedElement: SelectedGraphElement;
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  onEdit: () => void;
  onDelete: () => void;
};

function ActionButton({
  children,
  onClick,
  theme,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  theme: GraphTheme;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[6px] border px-3 py-2 font-mono text-[12px] transition-all"
      style={{
        borderColor: theme.border,
        backgroundColor: danger ? "transparent" : theme.panelSurface,
        color: danger ? theme.mutedText : theme.strongText,
      }}
    >
      {children}
    </button>
  );
}

export default function ElementActionMenu({
  theme,
  selectedElement,
  selectedNode,
  selectedEdge,
  onEdit,
  onDelete,
}: ElementActionMenuProps) {
  if (!selectedElement) {
    return null;
  }

  const description =
    selectedElement.type === "node"
      ? `nodo ${selectedNode?.id ?? selectedElement.id}`
      : `arista ${selectedEdge?.source ?? ""} → ${selectedEdge?.target ?? ""}`;

  return (
    <div className="pointer-events-none absolute right-4 top-4 z-20">
      <div
        className="pointer-events-auto min-w-[240px] rounded-[10px] border p-3 shadow-2xl backdrop-blur-sm"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.panelBg,
        }}
      >
        <div
          className="font-mono text-[11px] uppercase tracking-[0.04em]"
          style={{ color: theme.mutedText }}
        >
          {"// selección actual"}
        </div>

        <div
          className="mt-1 font-mono text-[13px] font-semibold"
          style={{ color: theme.strongText }}
        >
          {description}
        </div>

        <div
          className="mt-1 font-mono text-[11px] leading-[1.5]"
          style={{ color: theme.secondaryText }}
        >
          Enter para editar · Supr para eliminar
        </div>

        <div className="mt-3 flex items-center gap-2">
          <ActionButton onClick={onEdit} theme={theme}>
            editar
          </ActionButton>
          <ActionButton onClick={onDelete} theme={theme} danger>
            eliminar
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
