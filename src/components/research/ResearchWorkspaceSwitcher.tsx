"use client";

import type { RefObject } from "react";
import type { ResearchWorkspaceListItem } from "@/lib/research/types";
import { smallButtonClassName } from "@/components/research/researchUiConfig";

type ResearchWorkspaceSwitcherProps = {
  workspaceName: string;
  workspaceList: ResearchWorkspaceListItem[];
  selectedWorkspaceId: string | null;
  workspaceNameDraft: string;
  workspaceRenameDrafts: Record<string, string>;
  isOpen: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  onToggleOpen: () => void;
  onNavigateToWorkspace: (workspaceId: string) => void;
  onCreateWorkspace: () => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onRenameWorkspace: (workspaceId: string, proposedName?: string) => void;
  onWorkspaceRenameDraftChange: (workspaceId: string, value: string) => void;
  onWorkspaceNameDraftChange: (value: string) => void;
  onCommitWorkspaceName: () => void;
};

export default function ResearchWorkspaceSwitcher({
  workspaceName,
  workspaceList,
  selectedWorkspaceId,
  workspaceNameDraft,
  workspaceRenameDrafts,
  isOpen,
  menuRef,
  onToggleOpen,
  onNavigateToWorkspace,
  onCreateWorkspace,
  onDeleteWorkspace,
  onRenameWorkspace,
  onWorkspaceRenameDraftChange,
  onWorkspaceNameDraftChange,
  onCommitWorkspaceName,
}: ResearchWorkspaceSwitcherProps) {
  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="flex min-h-[44px] min-w-[320px] max-w-[520px] items-center justify-center gap-2 rounded-[6px] border border-[var(--br)] bg-[var(--bg3)] px-4 py-2 text-center transition-colors hover:bg-[var(--bg)]"
        onClick={onToggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="truncate text-[13px] font-semibold text-[var(--tx)]">
          {workspaceName.trim() || "Workspace sin nombre"}
        </span>
        <span className="text-[11px] text-[var(--tx4)]">▾</span>
      </button>

      {isOpen ? (
        <div className="absolute left-1/2 top-[52px] z-50 w-[420px] -translate-x-1/2 border border-[var(--br)] bg-[var(--bg2)] shadow-lg">
          <div className="border-b border-[var(--br)] p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-[var(--tx4)]">
                  workspaces actuales
                </p>
                <p className="mt-1 text-[11px] text-[var(--tx3)]">
                  cambia de workspace, renómbralo o elimínalo desde aquí
                </p>
              </div>
              <button type="button" className={smallButtonClassName} onClick={onCreateWorkspace}>
                + nuevo
              </button>
            </div>
          </div>

          <div className="max-h-[320px] overflow-y-auto p-2">
            {workspaceList.map((workspaceItem) => (
              <div
                key={workspaceItem.id}
                className={`mb-2 rounded border p-2 ${
                  workspaceItem.id === selectedWorkspaceId
                    ? "border-[var(--acc3)] bg-[var(--acc2)]"
                    : "border-[var(--br)] bg-[var(--bg3)]"
                }`}
              >
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => onNavigateToWorkspace(workspaceItem.id)}
                  >
                    <div
                      className={`truncate text-[11px] ${
                        workspaceItem.id === selectedWorkspaceId
                          ? "font-bold text-[var(--tx)]"
                          : "text-[var(--tx2)]"
                      }`}
                    >
                      {workspaceItem.name}
                    </div>
                    <div className="mt-1 text-[10px] text-[var(--tx4)]">
                      {workspaceItem.paperCount} papers · {workspaceItem.layerCount} capas ·{" "}
                      {workspaceItem.visibility === "link-readonly" ? "link-readonly" : "private"}
                    </div>
                  </button>

                  <div className="w-[160px] shrink-0">
                    <input
                      className="w-full rounded border border-[var(--br)] bg-[var(--bg)] px-2 py-1 text-[11px] text-[var(--tx)] outline-none focus:border-[var(--tx3)] focus:bg-[var(--bg2)]"
                      value={workspaceRenameDrafts[workspaceItem.id] ?? workspaceItem.name}
                      onChange={(event) =>
                        onWorkspaceRenameDraftChange(workspaceItem.id, event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          onRenameWorkspace(workspaceItem.id, event.currentTarget.value);
                        }
                      }}
                    />
                    <div className="mt-1 flex justify-end gap-1">
                      <button
                        type="button"
                        className="px-1 text-[10px] text-[var(--tx3)] hover:text-[var(--tx)]"
                        onClick={() =>
                          onRenameWorkspace(
                            workspaceItem.id,
                            workspaceRenameDrafts[workspaceItem.id] ?? workspaceItem.name,
                          )
                        }
                      >
                        guardar
                      </button>
                      <button
                        type="button"
                        className="px-1 text-[10px] text-red-400 hover:text-red-600"
                        onClick={() => onDeleteWorkspace(workspaceItem.id)}
                      >
                        borrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedWorkspaceId ? (
            <div className="border-t border-[var(--br)] p-3">
              <p className="mb-1 text-[10px] uppercase tracking-wide text-[var(--tx4)]">
                nombre del workspace activo
              </p>
              <input
                className="w-full rounded border border-[var(--br)] bg-[var(--bg3)] px-2 py-1.5 text-[12px] text-[var(--tx)] outline-none"
                value={workspaceNameDraft}
                onChange={(event) => onWorkspaceNameDraftChange(event.target.value)}
                onBlur={onCommitWorkspaceName}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onCommitWorkspaceName();
                    event.currentTarget.blur();
                  }
                }}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
