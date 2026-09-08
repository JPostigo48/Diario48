import type { ResearchWorkspace } from "@/lib/research/types";

export type PersistWorkspaceDraft = (
  nextWorkspace: ResearchWorkspace,
  successMessage: string,
) => Promise<ResearchWorkspace | null>;

export type CommitWorkspaceDraft = (
  updater: (current: ResearchWorkspace) => ResearchWorkspace,
  successMessage: string,
) => Promise<ResearchWorkspace | null>;
