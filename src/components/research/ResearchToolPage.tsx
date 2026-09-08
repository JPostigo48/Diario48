"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AuthStatusControls from "@/components/auth/AuthStatusControls";
import PaperFormModal from "@/components/research/PaperFormModal";
import ResearchFiltersBar from "@/components/research/ResearchFiltersBar";
import type { PaperVisibleColumn } from "@/components/research/ResearchFiltersBar";
import ResearchInspectorPanel from "@/components/research/ResearchInspectorPanel";
import ResearchPdfPanel from "@/components/research/ResearchPdfPanel";
import ResearchPapersPanel from "@/components/research/ResearchPapersPanel";
import ResearchWorkspaceSwitcher from "@/components/research/ResearchWorkspaceSwitcher";
import { DEFAULT_VISIBLE, primarySmallButtonClassName, smallButtonClassName } from "@/components/research/researchUiConfig";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import ToolTopbar from "@/components/ui/ToolTopbar";
import { useThemeMode } from "@/components/ui/useThemeMode";
import { usePaperFilters } from "@/features/papers-review/paper-filters/usePaperFilters";
import { useWorkspacePaperActions } from "@/features/papers-review/paper-management/useWorkspacePaperActions";
import { useResearchWorkspaceController } from "@/features/papers-review/workspace-management/useResearchWorkspaceController";
import type {
  PaperRelation,
  ResearchPaper,
} from "@/lib/research/types";
import { createDraftPaperForLayer } from "@/lib/research/utils";

type ModalState =
  | { type: "paper"; paper: ResearchPaper | null }
  | { type: "relation"; relationId?: string }
  | null;

type ResearchToolPageProps = {
  initialWorkspaceId?: string | null;
};

export default function ResearchToolPage({
  initialWorkspaceId = null,
}: ResearchToolPageProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeMode();
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table" | "graph" | "selection">("cards");
  const [visibleColumns, setVisibleColumns] = useState<PaperVisibleColumn[]>(DEFAULT_VISIBLE);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const workspaceMenuRef = useRef<HTMLDivElement | null>(null);

  const workspaceController = useResearchWorkspaceController({
    initialWorkspaceId,
    visibleColumns,
    onNavigateToWorkspace: (workspaceId) => router.push(`/tools/papers-review/${workspaceId}`),
  });

  const {
    workspace,
    workspaceList,
    selectedWorkspaceId,
    workspaceNameDraft,
    setWorkspaceNameDraft,
    workspaceRenameDrafts,
    setWorkspaceRenameDrafts,
    saveMessage,
    loading,
    loadWorkspace,
    commitWorkspace,
    actions,
  } = workspaceController;

  const {
    filteredPapers,
    yearOptions,
    layerOptions,
    categoryOptions,
    searchText,
    setSearchText,
    selectedYear,
    setSelectedYear,
    selectedLayerId,
    setSelectedLayerId,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    selectedWorkflowStatus,
    setSelectedWorkflowStatus,
    selectedReadingStatus,
    setSelectedReadingStatus,
    onlyWithPdf,
    setOnlyWithPdf,
  } = usePaperFilters(workspace);

  useEffect(() => {
    if (!workspace) {
      setSelectedPaperId(null);
      return;
    }

    setSelectedPaperId((current) => {
      if (current && workspace.papers.some((paper) => paper.id === current)) {
        return current;
      }

      return workspace.papers[0]?.id ?? null;
    });
  }, [workspace]);

  useEffect(() => {
    if (!workspaceMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        workspaceMenuRef.current &&
        !workspaceMenuRef.current.contains(event.target as Node)
      ) {
        setWorkspaceMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWorkspaceMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [workspaceMenuOpen]);

  const paperActions = useWorkspacePaperActions({
    commitWorkspace,
    onPaperSaved: (paper) => {
      setSelectedPaperId(paper.id);
      setModalState(null);
    },
    onRelationSaved: () => {
      setModalState(null);
    },
    onPaperDeleted: (paperId) => {
      setModalState(null);
      setSelectedPaperId((current) => (current === paperId ? null : current));
    },
    onWorkflowStatusChanged: (paperId) => {
      setSelectedPaperId(paperId);
    },
    onSelectionEvaluationSaved: (paperId) => {
      setSelectedPaperId(paperId);
    },
    onPaperPromotedToSynthesis: (paperId) => {
      setSelectedPaperId(paperId);
    },
    onAnalyticalClassificationSaved: (paperId) => {
      setSelectedPaperId(paperId);
    },
  });

  const selectedPaper = workspace?.papers.find((paper) => paper.id === selectedPaperId) ?? null;

  if (loading || !workspace) {
    return (
      <main className="flex h-screen items-center justify-center bg-[var(--bg)] text-[var(--tx)]">
        <div className="text-center">
          <div className="font-mono text-[12px] text-[var(--acc)]">
            inicializando Papers Review...
          </div>
          <div className="mt-2 text-[13px] text-[var(--tx3)]">
            preparando tu workspace de investigación
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen select-none flex-col overflow-hidden bg-[var(--bg)] font-mono text-xs text-[var(--tx)]">
      <ToolTopbar
        className="z-20 shrink-0 border-[var(--br)] bg-[var(--bg2)]"
        centerClassName="relative min-w-0 justify-self-center"
        left={
          <Link
            href="/"
            className="font-mono text-[17px] font-bold no-underline transition-opacity hover:opacity-75"
          >
            Diario<span className="text-[var(--acc)]">48</span>
            <span className="mx-2 text-[14px] font-normal text-[var(--tx4)]">/</span>
            <span className="text-[13px] font-normal text-[var(--tx3)]">papers review</span>
          </Link>
        }
        center={
          <ResearchWorkspaceSwitcher
            workspaceName={workspace.project.name}
            workspaceList={workspaceList}
            selectedWorkspaceId={selectedWorkspaceId}
            workspaceNameDraft={workspaceNameDraft}
            workspaceRenameDrafts={workspaceRenameDrafts}
            isOpen={workspaceMenuOpen}
            menuRef={workspaceMenuRef}
            onToggleOpen={() => setWorkspaceMenuOpen((current) => !current)}
            onNavigateToWorkspace={(workspaceId) => {
              void loadWorkspace(workspaceId).then((normalizedWorkspace) => {
                if (normalizedWorkspace) {
                  setSelectedPaperId(normalizedWorkspace.papers[0]?.id ?? null);
                }
              });
              router.push(`/tools/papers-review/${workspaceId}`);
              setWorkspaceMenuOpen(false);
            }}
            onCreateWorkspace={() => void actions.createWorkspace()}
            onDeleteWorkspace={(workspaceId) => void actions.deleteWorkspace(workspaceId)}
            onRenameWorkspace={(workspaceId, proposedName) =>
              void actions.renameWorkspace(workspaceId, proposedName)
            }
            onWorkspaceRenameDraftChange={(workspaceId, value) =>
              setWorkspaceRenameDrafts((current) => ({
                ...current,
                [workspaceId]: value,
              }))
            }
            onWorkspaceNameDraftChange={setWorkspaceNameDraft}
            onCommitWorkspaceName={() => void actions.commitWorkspaceName()}
          />
        }
        right={
          <div className="flex items-center gap-2">
            <AuthStatusControls variant="tool" nextPath="/tools/papers-review" />
            <select
              className={smallButtonClassName}
              value={workspace.visibility ?? "private"}
              onChange={(event) =>
                void actions.changeVisibility(
                  event.target.value as "private" | "link-readonly",
                )
              }
            >
              <option value="private">private</option>
              <option value="link-readonly">link-readonly</option>
            </select>
            <button
              type="button"
              className={smallButtonClassName}
              onClick={() => void actions.copyWorkspaceLink()}
            >
              copiar link
            </button>
            <button
              type="button"
              className={smallButtonClassName}
              onClick={actions.downloadTemplateJson}
            >
              plantilla JSON
            </button>
            <label className={`${smallButtonClassName} cursor-pointer`}>
              importar JSON
              <input
                ref={importInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={(event) => {
                  void actions.importFile(event.target.files?.[0] ?? null).finally(() => {
                    if (importInputRef.current) {
                      importInputRef.current.value = "";
                    }
                  });
                }}
              />
            </label>
            <button type="button" className={smallButtonClassName} onClick={actions.exportJson}>
              exportar JSON
            </button>
            <button
              type="button"
              className={primarySmallButtonClassName}
              onClick={() =>
                setModalState({
                  type: "paper",
                  paper: createDraftPaperForLayer(selectedLayerId || workspace.layers[0]?.id),
                })
              }
            >
              + agregar paper
            </button>
            <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
          </div>
        }
      />

      <ResearchFiltersBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        selectedYear={selectedYear}
        onSelectedYearChange={setSelectedYear}
        yearOptions={yearOptions}
        selectedLayerId={selectedLayerId}
        onSelectedLayerIdChange={setSelectedLayerId}
        layerOptions={layerOptions}
        selectedCategory={selectedCategory}
        onSelectedCategoryChange={setSelectedCategory}
        categoryOptions={categoryOptions}
        selectedPriority={selectedPriority}
        onSelectedPriorityChange={setSelectedPriority}
        selectedWorkflowStatus={selectedWorkflowStatus}
        onSelectedWorkflowStatusChange={setSelectedWorkflowStatus}
        selectedReadingStatus={selectedReadingStatus}
        onSelectedReadingStatusChange={setSelectedReadingStatus}
        onlyWithPdf={onlyWithPdf}
        onOnlyWithPdfChange={setOnlyWithPdf}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        columnsOpen={columnsOpen}
        onToggleColumnsOpen={() => setColumnsOpen((current) => !current)}
        visibleColumns={visibleColumns}
        onToggleVisibleColumn={(column) =>
          setVisibleColumns((current) =>
            current.includes(column)
              ? current.filter((entry) => entry !== column)
              : [...current, column],
          )
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <ResearchPapersPanel
          papers={filteredPapers}
          relations={workspace.relations}
          layers={workspace.layers}
          selectedPaperId={selectedPaperId}
          onSelectPaper={setSelectedPaperId}
          viewMode={viewMode}
          visibleColumns={visibleColumns}
          saveMessage={saveMessage}
        />

        {viewMode === "cards" ? (
          <div className="grid flex-1 grid-cols-[minmax(0,1fr)_clamp(320px,30vw,30vw)] overflow-hidden">
            <ResearchPdfPanel selectedPaper={selectedPaper} />
            <ResearchInspectorPanel
              selectedPaper={selectedPaper}
              layers={workspace.layers}
              onEdit={() => selectedPaper && setModalState({ type: "paper", paper: selectedPaper })}
              onDelete={() => selectedPaper && void paperActions.deletePaper(selectedPaper.id)}
              onWorkflowStatusChange={(paperId, nextStatus) =>
                void paperActions.changeWorkflowStatus(paperId, nextStatus)
              }
              onSaveSelectionEvaluation={(paperId, selectionEvaluation) =>
                void paperActions.saveSelectionEvaluation(paperId, selectionEvaluation)
              }
              onPromoteToSynthesis={(paperId, justification) =>
                void paperActions.promoteToSynthesis(paperId, justification)
              }
              onSaveAnalyticalClassification={(paperId, analyticalClassification) =>
                void paperActions.saveAnalyticalClassification(paperId, analyticalClassification)
              }
            />
          </div>
        ) : (
          <div className="w-[30vw] min-w-[320px] shrink-0 overflow-hidden">
            <ResearchInspectorPanel
              selectedPaper={selectedPaper}
              layers={workspace.layers}
              onEdit={() => selectedPaper && setModalState({ type: "paper", paper: selectedPaper })}
              onDelete={() => selectedPaper && void paperActions.deletePaper(selectedPaper.id)}
              onWorkflowStatusChange={(paperId, nextStatus) =>
                void paperActions.changeWorkflowStatus(paperId, nextStatus)
              }
              onSaveSelectionEvaluation={(paperId, selectionEvaluation) =>
                void paperActions.saveSelectionEvaluation(paperId, selectionEvaluation)
              }
              onPromoteToSynthesis={(paperId, justification) =>
                void paperActions.promoteToSynthesis(paperId, justification)
              }
              onSaveAnalyticalClassification={(paperId, analyticalClassification) =>
                void paperActions.saveAnalyticalClassification(paperId, analyticalClassification)
              }
            />
          </div>
        )}
      </div>

      {modalState ? (
        <PaperFormModal
          mode={modalState.type}
          paper={modalState.type === "paper" ? modalState.paper : null}
          relation={
            modalState.type === "relation"
              ? workspace.relations.find((relation) => relation.id === modalState.relationId) ?? null
              : null
          }
          papers={workspace.papers}
          layers={workspace.layers}
          onClose={() => setModalState(null)}
          onSavePaper={(paper) => void paperActions.savePaper(paper)}
          onSaveRelation={(relation: PaperRelation) => void paperActions.saveRelation(relation)}
        />
      ) : null}
    </div>
  );
}
