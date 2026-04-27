import SavedGraphsPanel from "./SavedGraphsPanel";
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
  onLoadExample: () => void;
  onClearGraph: () => void;
  onSaveGraph: () => void;
  onRefreshSavedGraphs: () => void;
  onLoadSavedGraph: (graphId: string) => void;
};

function TextInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-[4px] border border-[#1a1d28] bg-[#111318] px-2 py-1.5 font-mono text-[11px] text-[#dde1ea] outline-none transition-colors placeholder:text-[#374151] focus:border-[#4f8ef755] ${className}`}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-[4px] border border-[#1a1d28] bg-[#111318] px-2 py-1.5 font-mono text-[11px] text-[#dde1ea] outline-none"
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
  onLoadExample,
  onClearGraph,
  onSaveGraph,
  onRefreshSavedGraphs,
  onLoadSavedGraph,
}: GraphEditorPanelProps) {
  const nodeOptions = graph?.nodes.map((node) => node.id) ?? [];

  return (
    <aside className="d48-scrollbar flex min-h-0 flex-col gap-3 overflow-y-auto bg-[#0a0b0e] p-3.5">
      <div>
        <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px] text-[#2a3040]">
          {"// grafo"}
        </div>
        <div className="space-y-1.5">
          <TextInput
            value={graphName}
            onChange={onGraphNameChange}
            placeholder="nombre"
          />
          <textarea
            value={graphDescription}
            onChange={(event) => onGraphDescriptionChange(event.target.value)}
            placeholder="descripción"
            rows={2}
            className="w-full resize-none rounded-[4px] border border-[#1a1d28] bg-[#111318] px-2 py-1.5 font-mono text-[11px] text-[#dde1ea] outline-none transition-colors placeholder:text-[#374151] focus:border-[#4f8ef755]"
          />
        </div>
      </div>

      <hr className="border-[#1a1d28]" />

      <div>
        <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px] text-[#2a3040]">
          {"// nodo"}
        </div>
        <div className="space-y-1.5">
          <div className="flex gap-1.5">
            <TextInput
              value={nodeId}
              onChange={onNodeIdChange}
              placeholder="ID"
              className="max-w-[62px]"
            />
            <TextInput
              value={nodeLabel}
              onChange={onNodeLabelChange}
              placeholder="etiqueta"
            />
          </div>
          <div className="flex gap-1.5">
            <TextInput
              value={nodeHeuristic}
              onChange={onNodeHeuristicChange}
              placeholder="heurística"
              className="flex-1"
            />
            <button
              type="button"
              onClick={onAddNode}
              className="rounded-[4px] border border-[#4f8ef755] bg-[#4f8ef718] px-2.5 py-1.5 font-mono text-[11px] font-bold text-[#4f8ef7] transition-colors hover:bg-[#4f8ef730]"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <hr className="border-[#1a1d28]" />

      <div>
        <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px] text-[#2a3040]">
          {"// arista"}
        </div>
        <div className="space-y-1.5">
          <div className="flex gap-1.5">
            <TextInput
              value={edgeSource}
              onChange={onEdgeSourceChange}
              placeholder="src"
            />
            <TextInput
              value={edgeTarget}
              onChange={onEdgeTargetChange}
              placeholder="dst"
            />
          </div>
          <div className="flex gap-1.5">
            <TextInput
              value={edgeWeight}
              onChange={onEdgeWeightChange}
              placeholder="peso"
              className="max-w-[72px]"
            />
            <button
              type="button"
              onClick={onAddEdge}
              className="rounded-[4px] border border-[#4f8ef755] bg-[#4f8ef718] px-2.5 py-1.5 font-mono text-[11px] font-bold text-[#4f8ef7] transition-colors hover:bg-[#4f8ef730]"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <hr className="border-[#1a1d28]" />

      <div>
        <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px] text-[#2a3040]">
          {"// configuración"}
        </div>

        <div className="space-y-1.5">
          <div>
            <div className="mb-1 font-mono text-[10px] text-[#4b5563]">nodo inicial</div>
            <SelectInput
              value={startNode}
              onChange={onStartNodeChange}
              options={nodeOptions}
            />
          </div>
          <div>
            <div className="mb-1 font-mono text-[10px] text-[#4b5563]">nodo objetivo</div>
            <SelectInput
              value={goalNode}
              onChange={onGoalNodeChange}
              options={nodeOptions}
            />
          </div>
          <div>
            <div className="mb-1 font-mono text-[10px] text-[#4b5563]">
              heurística h(n) — A*
            </div>
            <div className="rounded-[4px] border border-[#1a1d28] bg-[#111318] px-2 py-1.5 font-mono text-[9px] text-[#4b5563]">
              Se edita nodo por nodo desde el formulario superior.
            </div>
          </div>
        </div>
      </div>

      <hr className="border-[#1a1d28]" />

      <div className="space-y-1.5">
        <button
          type="button"
          onClick={onLoadExample}
          className="w-full rounded-[4px] border border-[#22c55e33] bg-transparent px-2.5 py-2 text-left font-mono text-[10px] text-[#22c55e88] transition-all hover:bg-[#22c55e10] hover:text-[#22c55e]"
        >
          ↓ cargar grafo de ejemplo
        </button>
        <button
          type="button"
          onClick={onSaveGraph}
          className="w-full rounded-[4px] border border-[#4f8ef733] bg-transparent px-2.5 py-2 text-left font-mono text-[10px] text-[#4f8ef7] transition-all hover:bg-[#4f8ef710]"
        >
          💾 guardar grafo
        </button>
        <button
          type="button"
          onClick={onClearGraph}
          className="w-full rounded-[4px] border border-[#ef444433] bg-transparent px-2.5 py-2 text-left font-mono text-[10px] text-[#ef444488] transition-all hover:bg-[#ef444410] hover:text-[#ef4444]"
        >
          ⌫ limpiar grafo
        </button>
      </div>

      {saveMessage ? (
        <div className="rounded-[4px] border border-[#1a1d28] bg-[#111318] px-2.5 py-2 font-mono text-[9px] leading-[1.5] text-[#6b7280]">
          {saveMessage}
        </div>
      ) : null}

      <div className="min-h-[220px] flex-1">
        <SavedGraphsPanel
          graphs={savedGraphs}
          loading={loadingSavedGraphs}
          message={loadMessage}
          onRefresh={onRefreshSavedGraphs}
          onLoad={onLoadSavedGraph}
        />
      </div>
    </aside>
  );
}
