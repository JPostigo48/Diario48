"use client";

import type { ResearchLayer, ResearchWorkspaceListItem } from "@/lib/research/types";

type WorkspaceSidebarProps = {
  workspaceList: ResearchWorkspaceListItem[];
  selectedWorkspaceId: string | null;
  layers: ResearchLayer[];
  onSelectWorkspace: (workspaceId: string) => void;
  onCreateWorkspace: () => void;
  onDeleteWorkspace: () => void;
  onWorkspaceNameChange: (value: string) => void;
  onWorkspaceNameCommit: (value: string) => void;
  workspaceName: string;
  onAddLayer: () => void;
  onUpdateLayer: (layerId: string, patch: Partial<ResearchLayer>) => void;
  onCommitLayer: (layerId: string, patch: Partial<ResearchLayer>) => void;
  onMoveLayer: (layerId: string, direction: "up" | "down") => void;
  onDeleteLayer: (layerId: string) => void;
};

export default function WorkspaceSidebar({
  workspaceList,
  selectedWorkspaceId,
  layers,
  onSelectWorkspace,
  onCreateWorkspace,
  onDeleteWorkspace,
  onWorkspaceNameChange,
  onWorkspaceNameCommit,
  workspaceName,
  onAddLayer,
  onUpdateLayer,
  onCommitLayer,
  onMoveLayer,
  onDeleteLayer,
}: WorkspaceSidebarProps) {
  return (
    <aside className="d48-scrollbar flex h-full flex-col overflow-y-auto border-r border-[var(--br)] bg-[var(--bg2)]">
      <div className="border-b border-[var(--br)] px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--tx3)]">
            workspaces
          </span>
          <button
            type="button"
            onClick={onCreateWorkspace}
            className="rounded-[10px] border border-[var(--acc3)] bg-[var(--acc2)] px-2.5 py-1 font-mono text-[10px] text-[var(--tx)]"
          >
            nuevo
          </button>
        </div>

        <div className="space-y-2">
          {workspaceList.map((workspace) => {
            const isActive = workspace.id === selectedWorkspaceId;

            return (
              <button
                key={workspace.id}
                type="button"
                onClick={() => onSelectWorkspace(workspace.id)}
                className="w-full rounded-[12px] border px-3 py-2 text-left transition-all"
                style={{
                  borderColor: isActive ? "var(--acc3)" : "var(--br)",
                  backgroundColor: isActive ? "var(--acc2)" : "var(--bg3)",
                }}
              >
                <div className="text-[13px] font-medium text-[var(--tx)]">{workspace.name}</div>
                <div className="mt-1 text-[11px] text-[var(--tx3)]">
                  {workspace.paperCount} papers · {workspace.layerCount} capas
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--tx3)]">
            nombre actual
          </label>
          <input
            value={workspaceName}
            onChange={(event) => onWorkspaceNameChange(event.target.value)}
            onBlur={(event) => onWorkspaceNameCommit(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onWorkspaceNameCommit(event.currentTarget.value);
                event.currentTarget.blur();
              }
            }}
            className="w-full rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[13px] text-[var(--tx)] outline-none"
            placeholder="Proyecto de revisión"
          />
        </div>

        <button
          type="button"
          onClick={onDeleteWorkspace}
          className="mt-3 w-full rounded-[12px] border border-[var(--br)] bg-transparent px-3 py-2 font-mono text-[11px] text-[var(--tx3)]"
        >
          eliminar workspace
        </button>
      </div>

      <div className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--tx3)]">
            capas del embudo
          </span>
          <button
            type="button"
            onClick={onAddLayer}
            className="rounded-[10px] border border-[var(--acc3)] bg-[var(--acc2)] px-2.5 py-1 font-mono text-[10px] text-[var(--tx)]"
          >
            agregar
          </button>
        </div>

        <div className="space-y-3">
          {layers.length ? (
            layers.map((layer, index) => (
              <div
                key={layer.id}
                className="rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-[var(--tx3)]">
                    capa {index + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => onMoveLayer(layer.id, "up")}
                      className="rounded-[8px] border border-[var(--br)] px-2 py-1 text-[10px] text-[var(--tx2)]"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveLayer(layer.id, "down")}
                      className="rounded-[8px] border border-[var(--br)] px-2 py-1 text-[10px] text-[var(--tx2)]"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteLayer(layer.id)}
                      className="rounded-[8px] border border-[var(--br)] px-2 py-1 text-[10px] text-[var(--tx2)]"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <input
                  value={layer.name}
                  onChange={(event) => onUpdateLayer(layer.id, { name: event.target.value })}
                  onBlur={(event) => onCommitLayer(layer.id, { name: event.target.value })}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      onCommitLayer(layer.id, { name: event.currentTarget.value });
                      event.currentTarget.blur();
                    }
                  }}
                  className="mb-2 w-full rounded-[10px] border border-[var(--br)] bg-[var(--bg2)] px-3 py-2 text-[13px] text-[var(--tx)] outline-none"
                />
                <textarea
                  value={layer.description ?? ""}
                  onChange={(event) =>
                    onUpdateLayer(layer.id, { description: event.target.value })
                  }
                  onBlur={(event) =>
                    onCommitLayer(layer.id, { description: event.target.value })
                  }
                  className="d48-scrollbar min-h-[72px] w-full resize-none rounded-[10px] border border-[var(--br)] bg-[var(--bg2)] px-3 py-2 text-[12px] text-[var(--tx2)] outline-none"
                  placeholder="Describe qué representa esta capa."
                />
              </div>
            ))
          ) : (
            <div className="rounded-[12px] border border-dashed border-[var(--br2)] bg-[var(--bg3)] px-3 py-4 text-[12px] text-[var(--tx3)]">
              Crea capas temáticas para estructurar el embudo de tu estado del arte.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
