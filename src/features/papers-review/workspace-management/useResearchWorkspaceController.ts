"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createWorkspaceRequest,
  deleteWorkspaceRequest,
  fetchWorkspace,
  fetchWorkspaceList,
  updateWorkspaceRequest,
} from "@/features/papers-review/workspace-management/api";
import {
  downloadWorkspaceTemplateJson,
  exportWorkspaceJson,
  parseImportedWorkspace,
} from "@/features/papers-review/import-export/json";
import { createEmptyWorkspace } from "@/lib/research/defaults";
import type { ResearchWorkspace, ResearchWorkspaceListItem } from "@/lib/research/types";
import { ensureWorkspaceShape } from "@/lib/research/utils";
import type { PaperVisibleColumn } from "@/components/research/ResearchFiltersBar";
import type {
  CommitWorkspaceDraft,
  PersistWorkspaceDraft,
} from "@/features/papers-review/workspace-management/contracts";

type UseResearchWorkspaceControllerOptions = {
  initialWorkspaceId?: string | null;
  visibleColumns: PaperVisibleColumn[];
  onNavigateToWorkspace: (workspaceId: string) => void;
};

export function useResearchWorkspaceController({
  initialWorkspaceId = null,
  visibleColumns,
  onNavigateToWorkspace,
}: UseResearchWorkspaceControllerOptions) {
  const [workspaceList, setWorkspaceList] = useState<ResearchWorkspaceListItem[]>([]);
  const [workspace, setWorkspace] = useState<ResearchWorkspace | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [workspaceNameDraft, setWorkspaceNameDraft] = useState("");
  const [workspaceRenameDrafts, setWorkspaceRenameDrafts] = useState<Record<string, string>>({});
  const [saveMessage, setSaveMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const syncWorkspaceRenameDrafts = useCallback((items: ResearchWorkspaceListItem[]) => {
    setWorkspaceRenameDrafts((current) => {
      const nextDrafts: Record<string, string> = {};

      for (const item of items) {
        nextDrafts[item.id] = current[item.id] ?? item.name;
      }

      return nextDrafts;
    });
  }, []);

  const refreshWorkspaceList = useCallback(async () => {
    const items = await fetchWorkspaceList();
    setWorkspaceList(items);
    syncWorkspaceRenameDrafts(items);
    return items;
  }, [syncWorkspaceRenameDrafts]);

  const loadWorkspace = useCallback(async (workspaceId: string) => {
    setLoading(true);

    try {
      const normalized = ensureWorkspaceShape(await fetchWorkspace(workspaceId));
      setWorkspace(normalized);
      setWorkspaceNameDraft(normalized.project.name);
      setWorkspaceRenameDrafts((current) => ({
        ...current,
        [workspaceId]: normalized.project.name,
      }));
      setSelectedWorkspaceId(workspaceId);
      return normalized;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const boot = async () => {
      try {
        const workspaces = await refreshWorkspaceList();

        if (!workspaces.length) {
          if (initialWorkspaceId) {
            throw new Error("El workspace solicitado no existe o ya no está disponible.");
          }

          const createdWorkspace = await createWorkspaceRequest(createEmptyWorkspace());
          if (!createdWorkspace.id) {
            throw new Error("No se pudo crear el workspace inicial.");
          }

          await refreshWorkspaceList();
          await loadWorkspace(createdWorkspace.id);
          setSaveMessage("Workspace inicial creado.");
          return;
        }

        const targetWorkspaceId =
          initialWorkspaceId && workspaces.some((item) => item.id === initialWorkspaceId)
            ? initialWorkspaceId
            : workspaces[0].id;

        await loadWorkspace(targetWorkspaceId);
      } catch (error) {
        setSaveMessage(
          error instanceof Error ? error.message : "No se pudo inicializar Papers Review.",
        );
        setLoading(false);
      }
    };

    void boot();
  }, [initialWorkspaceId, loadWorkspace, refreshWorkspaceList]);

  const persistWorkspace = useCallback<PersistWorkspaceDraft>(
    async (nextWorkspace, successMessage) => {
      if (!selectedWorkspaceId) {
        return null;
      }

      const normalized = ensureWorkspaceShape(
        await updateWorkspaceRequest(selectedWorkspaceId, nextWorkspace),
      );

      setWorkspace(normalized);
      setWorkspaceNameDraft(normalized.project.name);
      setWorkspaceRenameDrafts((current) => ({
        ...current,
        [normalized.id ?? selectedWorkspaceId]: normalized.project.name,
      }));
      setSaveMessage(successMessage);
      await refreshWorkspaceList();

      return normalized;
    },
    [refreshWorkspaceList, selectedWorkspaceId],
  );

  const commitWorkspace = useCallback<CommitWorkspaceDraft>(
    async (updater, successMessage) => {
      if (!workspace) {
        return null;
      }

      try {
        return await persistWorkspace(updater(workspace), successMessage);
      } catch (error) {
        setSaveMessage(error instanceof Error ? error.message : "No se pudo persistir el cambio.");
        return null;
      }
    },
    [persistWorkspace, workspace],
  );

  const handleCreateWorkspace = useCallback(async () => {
    const proposedName = window
      .prompt("Nombre del nuevo workspace", `Proyecto ${workspaceList.length + 1}`)
      ?.trim();

    if (!proposedName) {
      return;
    }

    try {
      const createdWorkspace = await createWorkspaceRequest(createEmptyWorkspace(proposedName));
      if (!createdWorkspace.id) {
        throw new Error("No se pudo crear el workspace.");
      }

      await refreshWorkspaceList();
      await loadWorkspace(createdWorkspace.id);
      onNavigateToWorkspace(createdWorkspace.id);
      setSaveMessage("Workspace creado.");
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "No se pudo crear el workspace.");
    }
  }, [loadWorkspace, onNavigateToWorkspace, refreshWorkspaceList, workspaceList.length]);

  const handleDeleteWorkspace = useCallback(
    async (workspaceId: string) => {
      if (workspaceList.length <= 1) {
        setSaveMessage("Necesitas conservar al menos un workspace.");
        return;
      }

      const workspaceToDelete = workspaceList.find((item) => item.id === workspaceId);
      const confirmed = window.confirm(
        `¿Eliminar workspace "${workspaceToDelete?.name ?? "sin nombre"}"?`,
      );

      if (!confirmed) {
        return;
      }

      try {
        await deleteWorkspaceRequest(workspaceId);

        const list = await refreshWorkspaceList();
        if (selectedWorkspaceId === workspaceId && list[0]) {
          await loadWorkspace(list[0].id);
          onNavigateToWorkspace(list[0].id);
        }
        setSaveMessage("Workspace eliminado.");
      } catch (error) {
        setSaveMessage(
          error instanceof Error ? error.message : "No se pudo eliminar el workspace.",
        );
      }
    },
    [loadWorkspace, onNavigateToWorkspace, refreshWorkspaceList, selectedWorkspaceId, workspaceList],
  );

  const handleRenameWorkspace = useCallback(
    async (workspaceId: string, proposedName?: string) => {
      const current = workspaceList.find((item) => item.id === workspaceId);
      const nextName = (
        proposedName ??
        workspaceRenameDrafts[workspaceId] ??
        current?.name ??
        ""
      ).trim();

      if (!nextName || !current) {
        return;
      }

      try {
        const normalizedWorkspace = ensureWorkspaceShape(await fetchWorkspace(workspaceId));
        const nextWorkspace = {
          ...normalizedWorkspace,
          project: {
            ...normalizedWorkspace.project,
            name: nextName,
          },
        };

        const normalized = ensureWorkspaceShape(
          await updateWorkspaceRequest(workspaceId, nextWorkspace),
        );

        setWorkspaceRenameDrafts((currentDrafts) => ({
          ...currentDrafts,
          [workspaceId]: normalized.project.name,
        }));

        if (workspaceId === selectedWorkspaceId) {
          setWorkspace(normalized);
          setWorkspaceNameDraft(normalized.project.name);
        }

        await refreshWorkspaceList();
        setSaveMessage("Workspace renombrado.");
      } catch (error) {
        setSaveMessage(
          error instanceof Error ? error.message : "No se pudo renombrar el workspace.",
        );
      }
    },
    [refreshWorkspaceList, selectedWorkspaceId, workspaceList, workspaceRenameDrafts],
  );

  const handleCommitWorkspaceName = useCallback(async () => {
    const nextName = workspaceNameDraft.trim();

    if (!workspace || !nextName) {
      setSaveMessage("El workspace debe tener nombre.");
      return;
    }

    const normalized = await persistWorkspace(
      {
        ...workspace,
        project: {
          ...workspace.project,
          name: nextName,
        },
      },
      "Nombre del workspace actualizado.",
    );

    if (normalized && selectedWorkspaceId) {
      setWorkspaceRenameDrafts((current) => ({
        ...current,
        [selectedWorkspaceId]: normalized.project.name,
      }));
    }
  }, [persistWorkspace, selectedWorkspaceId, workspace, workspaceNameDraft]);

  const handleVisibilityChange = useCallback(
    async (visibility: "private" | "link-readonly") => {
      if (!workspace?.id || workspace.visibility === visibility) {
        return;
      }

      try {
        const updatedWorkspace = ensureWorkspaceShape(
          await updateWorkspaceRequest(workspace.id, {
            ...workspace,
            visibility,
          }),
        );

        setWorkspace(updatedWorkspace);
        await refreshWorkspaceList();
        setSaveMessage(
          visibility === "link-readonly"
            ? "Workspace visible por link en modo lectura."
            : "Workspace vuelto a modo privado.",
        );
      } catch (error) {
        setSaveMessage(
          error instanceof Error ? error.message : "No se pudo cambiar la visibilidad.",
        );
      }
    },
    [refreshWorkspaceList, workspace],
  );

  const handleCopyWorkspaceLink = useCallback(async () => {
    if (!workspace?.id) {
      return;
    }

    await navigator.clipboard.writeText(
      `${window.location.origin}/tools/papers-review/${workspace.id}`,
    );
    setSaveMessage("Link del workspace copiado.");
  }, [workspace?.id]);

  const handleExportJson = useCallback(() => {
    if (!workspace) {
      return;
    }

    exportWorkspaceJson(workspace);
  }, [workspace]);

  const handleDownloadTemplateJson = useCallback(() => {
    if (!workspace) {
      return;
    }

    downloadWorkspaceTemplateJson(workspace, visibleColumns);
  }, [visibleColumns, workspace]);

  const handleImportFile = useCallback(
    async (file: File | null) => {
      if (!file || !workspace) {
        return;
      }

      try {
        const imported = await parseImportedWorkspace(file);

        await persistWorkspace(
          {
            ...workspace,
            ...imported,
            project: {
              ...workspace.project,
              ...imported.project,
              name: imported.project?.name || workspace.project.name,
              description: imported.project?.description || workspace.project.description,
            },
          },
          "Workspace importado desde JSON.",
        );
      } catch (error) {
        setSaveMessage(error instanceof Error ? error.message : "JSON inválido.");
      }
    },
    [persistWorkspace, workspace],
  );

  return {
    workspaceList,
    workspace,
    setWorkspace,
    selectedWorkspaceId,
    workspaceNameDraft,
    setWorkspaceNameDraft,
    workspaceRenameDrafts,
    setWorkspaceRenameDrafts,
    saveMessage,
    setSaveMessage,
    loading,
    refreshWorkspaceList,
    loadWorkspace,
    persistWorkspace,
    commitWorkspace,
    actions: {
      createWorkspace: handleCreateWorkspace,
      deleteWorkspace: handleDeleteWorkspace,
      renameWorkspace: handleRenameWorkspace,
      commitWorkspaceName: handleCommitWorkspaceName,
      changeVisibility: handleVisibilityChange,
      copyWorkspaceLink: handleCopyWorkspaceLink,
      exportJson: handleExportJson,
      downloadTemplateJson: handleDownloadTemplateJson,
      importFile: handleImportFile,
    },
  };
}
