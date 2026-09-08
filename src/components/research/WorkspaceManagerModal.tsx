"use client";

import type { ResearchWorkspaceListItem } from "@/lib/research/types";

type WorkspaceManagerModalProps = {
  currentWorkspaceName: string;
  workspaceList: ResearchWorkspaceListItem[];
  selectedWorkspaceId: string | null;
  draftWorkspaceName: string;
  onDraftWorkspaceNameChange: (value: string) => void;
  onClose: () => void;
  onSelectWorkspace: (workspaceId: string) => void;
  onCommitWorkspaceName: () => void;
  onCreateWorkspace: () => void;
  onDeleteWorkspace: () => void;
};

export default function WorkspaceManagerModal({
  currentWorkspaceName,
  workspaceList,
  selectedWorkspaceId,
  draftWorkspaceName,
  onDraftWorkspaceNameChange,
  onClose,
  onSelectWorkspace,
  onCommitWorkspaceName,
  onCreateWorkspace,
  onDeleteWorkspace,
}: WorkspaceManagerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-5 py-6">
      <div className="d48-scrollbar max-h-full w-full max-w-[760px] overflow-y-auto border border-[var(--br)] bg-[var(--bg2)] shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--br)] bg-[var(--bg2)] px-5 py-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[2px] text-[var(--acc)]">
              {"// workspace"}
            </div>
            <h3 className="mt-1 text-[22px] font-semibold text-[var(--tx)]">
              {currentWorkspaceName}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] border border-[var(--br)] px-3 py-2 font-mono text-[11px] text-[var(--tx2)]"
          >
            cerrar
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--tx3)]">
                workspaces disponibles
              </div>
              <button
                type="button"
                onClick={onCreateWorkspace}
                className="rounded-[10px] border border-[var(--acc3)] bg-[var(--acc2)] px-3 py-1.5 font-mono text-[10px] text-[var(--tx)]"
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
                    className="w-full border px-3 py-3 text-left transition-all"
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
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--tx3)]">
                nombre del workspace actual
              </label>
              <input
                value={draftWorkspaceName}
                onChange={(event) => onDraftWorkspaceNameChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onCommitWorkspaceName();
                  }
                }}
                className="w-full border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[13px] text-[var(--tx)] outline-none"
                placeholder="Proyecto de revisión"
              />
            </div>

            <button
              type="button"
              onClick={onCommitWorkspaceName}
              className="w-full border border-[var(--acc3)] bg-[var(--acc2)] px-3 py-2 font-mono text-[11px] text-[var(--tx)]"
            >
              guardar nombre
            </button>

            <button
              type="button"
              onClick={onDeleteWorkspace}
              disabled={workspaceList.length <= 1}
              className="w-full border border-[var(--br)] px-3 py-2 font-mono text-[11px] text-[var(--tx3)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              eliminar workspace actual
            </button>

            <div className="border border-dashed border-[var(--br2)] px-3 py-4 text-[12px] leading-relaxed text-[var(--tx3)]">
              Aquí irá luego la administración más completa del workspace, pero por ahora desde este modal ya puedes cambiar de proyecto, renombrarlo y crear otros nuevos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
