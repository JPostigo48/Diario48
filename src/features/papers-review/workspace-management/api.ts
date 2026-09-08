import type { ResearchWorkspace, ResearchWorkspaceListItem } from "@/lib/research/types";

export async function fetchWorkspaceList() {
  const response = await fetch("/api/research/workspaces");
  const payload = (await response.json()) as {
    data?: ResearchWorkspaceListItem[];
    error?: string;
  };

  if (!response.ok || !payload.data) {
    throw new Error(payload.error || "No se pudo cargar la lista de workspaces.");
  }

  return payload.data;
}

export async function fetchWorkspace(workspaceId: string) {
  const response = await fetch(`/api/research/workspaces/${workspaceId}`);
  const payload = (await response.json()) as { data?: ResearchWorkspace; error?: string };

  if (!response.ok || !payload.data) {
    throw new Error(payload.error || "No se pudo cargar el workspace.");
  }

  return payload.data;
}

export async function createWorkspaceRequest(workspace: ResearchWorkspace) {
  const response = await fetch("/api/research/workspaces", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workspace),
  });

  const payload = (await response.json()) as { data?: ResearchWorkspace; error?: string };
  if (!response.ok || !payload.data) {
    throw new Error(payload.error || "No se pudo crear el workspace.");
  }

  return payload.data;
}

export async function updateWorkspaceRequest(workspaceId: string, workspace: ResearchWorkspace) {
  const response = await fetch(`/api/research/workspaces/${workspaceId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workspace),
  });

  const payload = (await response.json()) as {
    data?: ResearchWorkspace;
    error?: string;
    details?: string[];
  };

  if (!response.ok || !payload.data) {
    throw new Error(payload.details?.join(" ") || payload.error || "No se pudo guardar.");
  }

  return payload.data;
}

export async function deleteWorkspaceRequest(workspaceId: string) {
  const response = await fetch(`/api/research/workspaces/${workspaceId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error || "No se pudo eliminar el workspace.");
  }
}
