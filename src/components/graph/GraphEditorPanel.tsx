import SavedGraphsPanel from "./SavedGraphsPanel";
import type { GraphTheme } from "@/lib/graph/theme";
import type { GraphData } from "@/lib/graph/types";

type GraphEditorPanelProps = {
  graph: GraphData | null;
  graphName: string;
  graphDescription: string;
  nodeId: string;
  nodeLabel: string;
  nodeHeuristic: string;
  edgeSource: string;
  edgeTarget: string;
  edgeWeight: string;
  startNode: string;
  goalNode: string;
  savedGraphs: GraphData[];
  loadingSavedGraphs: boolean;
  saveMessage: string;
  loadMessage: string;
  theme: GraphTheme;
  loadedGraphId: string | null;
  isMetadataEditing: boolean;
  isLoadModalOpen: boolean;
  onGraphNameChange: (value: string) => void;
  onGraphDescriptionChange: (value: string) => void;
  onNodeIdChange: (value: string) => void;
  onNodeLabelChange: (value: string) => void;
  onNodeHeuristicChange: (value: string) => void;
  onEdgeSourceChange: (value: string) => void;
  onEdgeTargetChange: (value: string) => void;
  onEdgeWeightChange: (value: string) => void;
  onStartNodeChange: (value: string) => void;
  onGoalNodeChange: (value: string) => void;
  onAddNode: () => void;
  onAddEdge: () => void;
  onClearGraph: () => void;
  onSaveNewGraph: () => void;
  onUpdateGraph: () => void;
  onRefreshSavedGraphs: () => void;
  onLoadSavedGraph: (graphId: string) => void;
  onOpenLoadModal: () => void;
  onCloseLoadModal: () => void;
  onEnableMetadataEditing: () => void;
};

function TextInput({
  value,
  onChange,
  placeholder,
  theme,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  theme: GraphTheme;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-[4px] border px-2 py-1.5 font-mono text-[11px] outline-none transition-colors ${className}`}
      style={{
        borderColor: theme.border,
        backgroundColor: theme.panelSurface,
        color: theme.strongText,
      }}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  theme,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  theme: GraphTheme;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-[4px] border px-2 py-1.5 font-mono text-[11px] outline-none"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.panelSurface,
        color: theme.strongText,
      }}
    >
      <option value="">—</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function PlusStyleIconButton({
  label,
  onClick,
  theme,
}: {
  label: string;
  onClick: () => void;
  theme: GraphTheme;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-[4px] border px-2.5 py-1.5 font-mono text-[11px] font-bold transition-colors"
      style={{
        borderColor: `${theme.accent}55`,
        backgroundColor: theme.accentSoft,
        color: theme.accent,
      }}
    >
      ✎
    </button>
  );
}

function ActionButton({
  children,
  onClick,
  theme,
  accent = false,
  danger = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  theme: GraphTheme;
  accent?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  let borderColor = theme.border;
  let color = theme.mutedText;
  let backgroundColor = "transparent";

  if (accent) {
    borderColor = `${theme.accent}33`;
    color = theme.accent;
    backgroundColor = theme.accentSoft;
  }

  if (danger) {
    borderColor = `${theme.danger}33`;
    color = `${theme.danger}bb`;
  }

  if (disabled) {
    borderColor = theme.border;
    color = theme.dimText;
    backgroundColor = "transparent";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-[4px] border px-2.5 py-2 text-left font-mono text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-100"
      style={{ borderColor, color, backgroundColor }}
    >
      {children}
    </button>
  );
}

export default function GraphEditorPanel({
  graph,
  graphName,
  graphDescription,
  nodeId,
  nodeLabel,
  nodeHeuristic,
  edgeSource,
  edgeTarget,
  edgeWeight,
  startNode,
  goalNode,
  savedGraphs,
  loadingSavedGraphs,
  saveMessage,
  loadMessage,
  theme,
  loadedGraphId,
  isMetadataEditing,
  isLoadModalOpen,
  onGraphNameChange,
  onGraphDescriptionChange,
  onNodeIdChange,
  onNodeLabelChange,
  onNodeHeuristicChange,
  onEdgeSourceChange,
  onEdgeTargetChange,
  onEdgeWeightChange,
  onStartNodeChange,
  onGoalNodeChange,
  onAddNode,
  onAddEdge,
  onClearGraph,
  onSaveNewGraph,
  onUpdateGraph,
  onRefreshSavedGraphs,
  onLoadSavedGraph,
  onOpenLoadModal,
  onCloseLoadModal,
  onEnableMetadataEditing,
}: GraphEditorPanelProps) {
  const nodeOptions = graph?.nodes.map((node) => node.id) ?? [];
  const isLoadedGraph = Boolean(loadedGraphId);

  return (
    <>
      <aside
        className="d48-scrollbar flex min-h-0 flex-col gap-3 overflow-y-auto p-3.5"
        style={{ backgroundColor: theme.panelBg }}
      >
        <div>
          <div
            className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px]"
            style={{ color: theme.dimText }}
          >
            {"// grafo"}
          </div>

          {isLoadedGraph && !isMetadataEditing ? (
            <div
              className="rounded-[6px] border p-2.5"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.panelSurface,
              }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div
                    className="truncate font-mono text-[12px] font-semibold"
                    style={{ color: theme.strongText }}
                  >
                    {graphName || "Sin título"}
                  </div>
                  <div
                    className="mt-1 font-mono text-[9px] uppercase tracking-[1.2px]"
                    style={{ color: theme.dimText }}
                  >
                    grafo cargado
                  </div>
                </div>

                <PlusStyleIconButton
                  label="Editar metadatos del grafo"
                  onClick={onEnableMetadataEditing}
                  theme={theme}
                />
              </div>

              <div
                className="font-mono text-[10px] leading-[1.6]"
                style={{ color: theme.mutedText }}
              >
                {graphDescription || "Sin descripción"}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <TextInput
                value={graphName}
                onChange={onGraphNameChange}
                placeholder="título del grafo"
                theme={theme}
              />
              <textarea
                value={graphDescription}
                onChange={(event) => onGraphDescriptionChange(event.target.value)}
                placeholder="descripción"
                rows={2}
                className="w-full resize-none rounded-[4px] border px-2 py-1.5 font-mono text-[11px] outline-none transition-colors"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.panelSurface,
                  color: theme.strongText,
                }}
              />
            </div>
          )}
        </div>

        <hr style={{ borderColor: theme.border }} />

        <div>
          <div
            className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px]"
            style={{ color: theme.dimText }}
          >
            {"// nodo"}
          </div>
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              <TextInput
                value={nodeId}
                onChange={onNodeIdChange}
                placeholder="ID"
                theme={theme}
                className="max-w-[62px]"
              />
              <TextInput
                value={nodeLabel}
                onChange={onNodeLabelChange}
                placeholder="etiqueta"
                theme={theme}
              />
            </div>
            <div className="flex gap-1.5">
              <TextInput
                value={nodeHeuristic}
                onChange={onNodeHeuristicChange}
                placeholder="heurística"
                theme={theme}
                className="flex-1"
              />
              <button
                type="button"
                onClick={onAddNode}
                className="rounded-[4px] border px-2.5 py-1.5 font-mono text-[11px] font-bold transition-colors"
                style={{
                  borderColor: `${theme.accent}55`,
                  backgroundColor: theme.accentSoft,
                  color: theme.accent,
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: theme.border }} />

        <div>
          <div
            className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px]"
            style={{ color: theme.dimText }}
          >
            {"// arista"}
          </div>
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              <TextInput
                value={edgeSource}
                onChange={onEdgeSourceChange}
                placeholder="src"
                theme={theme}
              />
              <TextInput
                value={edgeTarget}
                onChange={onEdgeTargetChange}
                placeholder="dst"
                theme={theme}
              />
            </div>
            <div className="flex gap-1.5">
              <TextInput
                value={edgeWeight}
                onChange={onEdgeWeightChange}
                placeholder="peso"
                theme={theme}
                className="max-w-[72px]"
              />
              <button
                type="button"
                onClick={onAddEdge}
                className="rounded-[4px] border px-2.5 py-1.5 font-mono text-[11px] font-bold transition-colors"
                style={{
                  borderColor: `${theme.accent}55`,
                  backgroundColor: theme.accentSoft,
                  color: theme.accent,
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: theme.border }} />

        <div>
          <div
            className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px]"
            style={{ color: theme.dimText }}
          >
            {"// configuración"}
          </div>

          <div className="space-y-1.5">
            <div>
              <div className="mb-1 font-mono text-[10px]" style={{ color: theme.mutedText }}>
                nodo inicial
              </div>
              <SelectInput
                value={startNode}
                onChange={onStartNodeChange}
                options={nodeOptions}
                theme={theme}
              />
            </div>
            <div>
              <div className="mb-1 font-mono text-[10px]" style={{ color: theme.mutedText }}>
                nodo objetivo
              </div>
              <SelectInput
                value={goalNode}
                onChange={onGoalNodeChange}
                options={nodeOptions}
                theme={theme}
              />
            </div>
            <div>
              <div className="mb-1 font-mono text-[10px]" style={{ color: theme.mutedText }}>
                heurística h(n) — A*
              </div>
              <div
                className="rounded-[4px] border px-2 py-1.5 font-mono text-[9px]"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.panelSurface,
                  color: theme.mutedText,
                }}
              >
                Se edita nodo por nodo desde el formulario superior.
              </div>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: theme.border }} />

        <div className="space-y-1.5">
          <ActionButton onClick={onOpenLoadModal} theme={theme}>
            cargar grafo
          </ActionButton>
          <ActionButton
            onClick={onUpdateGraph}
            theme={theme}
            accent
            disabled={!isLoadedGraph}
          >
            actualizar grafo
          </ActionButton>
          <ActionButton onClick={onSaveNewGraph} theme={theme} accent>
            guardar grafo
          </ActionButton>
          <ActionButton onClick={onClearGraph} theme={theme} danger>
            limpiar pantalla
          </ActionButton>
        </div>

        {saveMessage ? (
          <div
            className="rounded-[4px] border px-2.5 py-2 font-mono text-[9px] leading-[1.5]"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.panelSurface,
              color: theme.mutedText,
            }}
          >
            {saveMessage}
          </div>
        ) : null}
      </aside>

      {isLoadModalOpen ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 p-6">
          <div
            className="flex h-[min(78vh,680px)] w-[min(520px,100%)] flex-col rounded-[10px] border p-4 shadow-2xl"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.panelBg,
            }}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div
                  className="font-mono text-[8px] uppercase tracking-[1.5px]"
                  style={{ color: theme.dimText }}
                >
                  {"// cargar grafo"}
                </div>
                <div
                  className="mt-1 font-mono text-[12px] font-semibold"
                  style={{ color: theme.strongText }}
                >
                  Grafos guardados
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseLoadModal}
                className="rounded-[4px] border px-2.5 py-1.5 font-mono text-[11px] transition-colors"
                style={{
                  borderColor: theme.border,
                  color: theme.mutedText,
                }}
              >
                cerrar
              </button>
            </div>

            <div className="min-h-0 flex-1">
              <SavedGraphsPanel
                graphs={savedGraphs}
                loading={loadingSavedGraphs}
                message={loadMessage}
                theme={theme}
                onRefresh={onRefreshSavedGraphs}
                onLoad={onLoadSavedGraph}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
