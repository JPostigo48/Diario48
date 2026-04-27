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

function SectionLabel({
  title,
  hint,
  theme,
}: {
  title: string;
  hint?: string;
  theme: GraphTheme;
}) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-2">
      <span
        className="font-mono text-[11px] uppercase tracking-[0.04em]"
        style={{ color: theme.mutedText }}
      >
        {`// ${title}`}
      </span>
      {hint ? (
        <span className="font-mono text-[11px]" style={{ color: theme.faintText }}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}

function PanelCard({
  children,
  theme,
  footer = false,
}: {
  children: React.ReactNode;
  theme: GraphTheme;
  footer?: boolean;
}) {
  return (
    <div
      className={`rounded-[10px] border p-3 ${footer ? "" : ""}`}
      style={{
        borderColor: theme.border,
        backgroundColor: theme.panelBg,
      }}
    >
      {children}
    </div>
  );
}

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
      className={`w-full rounded-[6px] border px-3 py-2 font-mono text-[13px] outline-none transition-colors ${className}`}
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
      className="w-full rounded-[6px] border px-3 py-2 font-mono text-[13px] outline-none"
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

function TonePill({
  value,
  color,
  softColor,
}: {
  value: string;
  color: string;
  softColor: string;
}) {
  return (
    <span
      className="rounded-[4px] border px-2 py-0.5 font-mono text-[11px] font-semibold"
      style={{
        borderColor: `${color}55`,
        backgroundColor: softColor,
        color,
      }}
    >
      {value}
    </span>
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
      className="rounded-[6px] border px-2.5 py-2 font-mono text-[12px] font-bold transition-colors"
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

function PrimaryAddButton({
  onClick,
  theme,
}: {
  onClick: () => void;
  theme: GraphTheme;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[6px] border px-3 py-2 font-mono text-[14px] font-bold transition-colors"
      style={{
        borderColor: `${theme.accent}55`,
        backgroundColor: theme.accentSoft,
        color: theme.accent,
      }}
    >
      +
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
  let color = theme.strongText;
  let backgroundColor = theme.panelSurface;

  if (accent) {
    borderColor = theme.accent;
    color = "#ffffff";
    backgroundColor = theme.accent;
  }

  if (danger) {
    borderColor = theme.border;
    color = theme.mutedText;
    backgroundColor = "transparent";
  }

  if (disabled) {
    borderColor = theme.border;
    color = theme.dimText;
    backgroundColor = theme.panelSurface;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-[6px] border px-3 py-2.5 text-left font-mono text-[12px] transition-all disabled:cursor-not-allowed disabled:opacity-100"
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
  const graphStats = graph
    ? `${graph.nodes.length} nodos · ${graph.edges.length} aristas`
    : "borrador vacío";

  return (
    <>
      <aside
        className="d48-scrollbar flex min-h-0 flex-col gap-3 overflow-y-auto p-3.5"
        style={{ backgroundColor: theme.panelSurface }}
      >
        <PanelCard theme={theme}>
          <SectionLabel title="grafo" hint={isLoadedGraph ? "cargado" : "nuevo"} theme={theme} />

          {isLoadedGraph && !isMetadataEditing ? (
            <div
              className="rounded-[8px] border p-3"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.panelSurfaceAlt,
              }}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div
                    className="truncate font-mono text-[13px] font-semibold"
                    style={{ color: theme.strongText }}
                  >
                    {graphName || "Sin título"}
                  </div>
                  <div
                    className="mt-1 font-sans text-[12px]"
                    style={{ color: theme.mutedText }}
                  >
                    {graphStats}
                  </div>
                </div>

                <PlusStyleIconButton
                  label="Editar metadatos del grafo"
                  onClick={onEnableMetadataEditing}
                  theme={theme}
                />
              </div>

              <div
                className="font-sans text-[13px] leading-[1.55]"
                style={{ color: theme.secondaryText }}
              >
                {graphDescription || "Sin descripción"}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
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
                rows={3}
                className="w-full resize-none rounded-[6px] border px-3 py-2 font-sans text-[13px] outline-none transition-colors"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.panelSurface,
                  color: theme.strongText,
                }}
              />
              <div className="font-mono text-[11px]" style={{ color: theme.faintText }}>
                {graphStats}
              </div>
            </div>
          )}
        </PanelCard>

        <PanelCard theme={theme}>
          <SectionLabel title="nodos" hint="agregar" theme={theme} />
          <div className="grid grid-cols-[76px_1fr] gap-2">
            <TextInput
              value={nodeId}
              onChange={onNodeIdChange}
              placeholder="ID"
              theme={theme}
            />
            <TextInput
              value={nodeLabel}
              onChange={onNodeLabelChange}
              placeholder="etiqueta"
              theme={theme}
            />
            <div className="col-span-2 flex gap-2">
              <TextInput
                value={nodeHeuristic}
                onChange={onNodeHeuristicChange}
                placeholder="heurística h(n)"
                theme={theme}
                className="flex-1"
              />
              <PrimaryAddButton onClick={onAddNode} theme={theme} />
            </div>
          </div>
        </PanelCard>

        <PanelCard theme={theme}>
          <SectionLabel title="aristas" hint="agregar" theme={theme} />
          <div className="grid grid-cols-3 gap-2">
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
            <div className="flex gap-2">
              <TextInput
                value={edgeWeight}
                onChange={onEdgeWeightChange}
                placeholder="peso"
                theme={theme}
                className="flex-1"
              />
              <PrimaryAddButton onClick={onAddEdge} theme={theme} />
            </div>
          </div>
        </PanelCard>

        <PanelCard theme={theme}>
          <SectionLabel title="configuración" theme={theme} />

          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-mono text-[12px]" style={{ color: theme.secondaryText }}>
                  inicio
                </span>
                <TonePill value={startNode || "—"} color={theme.start} softColor={theme.accentSoft} />
              </div>
              <SelectInput
                value={startNode}
                onChange={onStartNodeChange}
                options={nodeOptions}
                theme={theme}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-mono text-[12px]" style={{ color: theme.secondaryText }}>
                  objetivo
                </span>
                <TonePill value={goalNode || "—"} color={theme.goal} softColor={theme.pathSoft} />
              </div>
              <SelectInput
                value={goalNode}
                onChange={onGoalNodeChange}
                options={nodeOptions}
                theme={theme}
              />
            </div>

            <div
              className="rounded-[8px] border px-3 py-2 font-mono text-[11px] leading-[1.55]"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.panelSurfaceAlt,
                color: theme.mutedText,
              }}
            >
              <span style={{ color: theme.secondaryText }}>h(n)</span> · se edita nodo por nodo
              desde el formulario superior.
              <br />
              <span style={{ color: theme.faintText }}>Se usa en A* y Greedy.</span>
            </div>
          </div>
        </PanelCard>

        <PanelCard theme={theme} footer>
          <div className="space-y-2">
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
            <ActionButton onClick={onSaveNewGraph} theme={theme}>
              guardar grafo
            </ActionButton>
            <ActionButton onClick={onClearGraph} theme={theme} danger>
              limpiar pantalla
            </ActionButton>
          </div>

          {saveMessage ? (
            <div
              className="mt-3 rounded-[8px] border px-3 py-2 font-mono text-[11px] leading-[1.55]"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.panelSurfaceAlt,
                color: theme.mutedText,
              }}
            >
              {saveMessage}
            </div>
          ) : null}
        </PanelCard>
      </aside>

      {isLoadModalOpen ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 p-6">
          <div
            className="flex h-[min(78vh,680px)] w-[min(560px,100%)] flex-col rounded-[12px] border p-4 shadow-2xl"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.panelBg,
            }}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div
                  className="font-mono text-[11px] uppercase tracking-[0.04em]"
                  style={{ color: theme.mutedText }}
                >
                  {"// cargar grafo"}
                </div>
                <div
                  className="mt-1 font-mono text-[14px] font-semibold"
                  style={{ color: theme.strongText }}
                >
                  Grafos guardados
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseLoadModal}
                className="rounded-[6px] border px-3 py-2 font-mono text-[12px] transition-colors"
                style={{
                  borderColor: theme.border,
                  color: theme.secondaryText,
                  backgroundColor: theme.panelSurface,
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
