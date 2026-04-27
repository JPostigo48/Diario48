import type { GraphTheme } from "@/lib/graph/theme";
import type { GraphEdge, GraphNode, SelectedGraphElement } from "@/lib/graph/types";

type ElementEditorModalProps = {
  theme: GraphTheme;
  selectedElement: SelectedGraphElement;
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  nodeLabel: string;
  nodeHeuristic: string;
  edgeWeight: string;
  onNodeLabelChange: (value: string) => void;
  onNodeHeuristicChange: (value: string) => void;
  onEdgeWeightChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
};

function ModalButton({
  children,
  onClick,
  theme,
  accent = false,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  theme: GraphTheme;
  accent?: boolean;
  danger?: boolean;
}) {
  let borderColor = theme.border;
  let color = theme.mutedText;
  let backgroundColor = "transparent";

  if (accent) {
    borderColor = `${theme.accent}55`;
    color = theme.accent;
    backgroundColor = theme.accentSoft;
  }

  if (danger) {
    borderColor = `${theme.danger}55`;
    color = theme.danger;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[4px] border px-3 py-1.5 font-mono text-[10px] transition-all"
      style={{ borderColor, color, backgroundColor }}
    >
      {children}
    </button>
  );
}

export default function ElementEditorModal({
  theme,
  selectedElement,
  selectedNode,
  selectedEdge,
  nodeLabel,
  nodeHeuristic,
  edgeWeight,
  onNodeLabelChange,
  onNodeHeuristicChange,
  onEdgeWeightChange,
  onClose,
  onSave,
  onDelete,
}: ElementEditorModalProps) {
  if (!selectedElement) {
    return null;
  }

  const isNode = selectedElement.type === "node";
  const title = isNode
    ? `editar nodo ${selectedNode?.id ?? ""}`
    : `editar arista ${selectedEdge?.source ?? ""} → ${selectedEdge?.target ?? ""}`;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 p-6">
      <div
        className="w-[min(460px,100%)] rounded-[10px] border p-4 shadow-2xl"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.panelBg,
        }}
      >
        <div className="mb-3">
          <div
            className="font-mono text-[8px] uppercase tracking-[1.5px]"
            style={{ color: theme.dimText }}
          >
            {"// edición contextual"}
          </div>
          <div
            className="mt-1 font-mono text-[12px] font-semibold"
            style={{ color: theme.strongText }}
          >
            {title}
          </div>
        </div>

        {isNode && selectedNode ? (
          <div className="space-y-2.5">
            <div>
              <div className="mb-1 font-mono text-[10px]" style={{ color: theme.mutedText }}>
                id
              </div>
              <div
                className="rounded-[4px] border px-2 py-1.5 font-mono text-[11px]"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.panelSurface,
                  color: theme.strongText,
                }}
              >
                {selectedNode.id}
              </div>
            </div>

            <div>
              <div className="mb-1 font-mono text-[10px]" style={{ color: theme.mutedText }}>
                etiqueta
              </div>
              <input
                value={nodeLabel}
                onChange={(event) => onNodeLabelChange(event.target.value)}
                className="w-full rounded-[4px] border px-2 py-1.5 font-mono text-[11px] outline-none"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.panelSurface,
                  color: theme.strongText,
                }}
              />
            </div>

            <div>
              <div className="mb-1 font-mono text-[10px]" style={{ color: theme.mutedText }}>
                heurística
              </div>
              <input
                value={nodeHeuristic}
                onChange={(event) => onNodeHeuristicChange(event.target.value)}
                className="w-full rounded-[4px] border px-2 py-1.5 font-mono text-[11px] outline-none"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.panelSurface,
                  color: theme.strongText,
                }}
              />
            </div>

            <div
              className="rounded-[4px] border px-2.5 py-2 font-mono text-[9px] leading-[1.5]"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.panelSurface,
                color: theme.mutedText,
              }}
            >
              Si eliminas este nodo, también se eliminarán sus aristas conectadas.
            </div>
          </div>
        ) : null}

        {!isNode && selectedEdge ? (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mb-1 font-mono text-[10px]" style={{ color: theme.mutedText }}>
                  source
                </div>
                <div
                  className="rounded-[4px] border px-2 py-1.5 font-mono text-[11px]"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.panelSurface,
                    color: theme.strongText,
                  }}
                >
                  {selectedEdge.source}
                </div>
              </div>
              <div>
                <div className="mb-1 font-mono text-[10px]" style={{ color: theme.mutedText }}>
                  target
                </div>
                <div
                  className="rounded-[4px] border px-2 py-1.5 font-mono text-[11px]"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.panelSurface,
                    color: theme.strongText,
                  }}
                >
                  {selectedEdge.target}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-1 font-mono text-[10px]" style={{ color: theme.mutedText }}>
                peso
              </div>
              <input
                value={edgeWeight}
                onChange={(event) => onEdgeWeightChange(event.target.value)}
                className="w-full rounded-[4px] border px-2 py-1.5 font-mono text-[11px] outline-none"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.panelSurface,
                  color: theme.strongText,
                }}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-2">
          <ModalButton onClick={onDelete} theme={theme} danger>
            eliminar
          </ModalButton>

          <div className="flex items-center gap-2">
            <ModalButton onClick={onClose} theme={theme}>
              cancelar
            </ModalButton>
            <ModalButton onClick={onSave} theme={theme} accent>
              guardar cambios
            </ModalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
