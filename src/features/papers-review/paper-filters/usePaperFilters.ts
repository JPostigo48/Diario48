"use client";

import { useMemo, useState } from "react";
import type {
  PaperPriority,
  PaperWorkflowStatus,
  ReadingStatus,
  ResearchWorkspace,
} from "@/lib/research/types";
import { workspaceHasPdf } from "@/lib/research/utils";

export function usePaperFilters(workspace: ResearchWorkspace | null) {
  const [searchText, setSearchText] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLayerId, setSelectedLayerId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<PaperPriority | "">("");
  const [selectedWorkflowStatus, setSelectedWorkflowStatus] = useState<PaperWorkflowStatus | "">("");
  const [selectedReadingStatus, setSelectedReadingStatus] = useState<ReadingStatus | "">("");
  const [onlyWithPdf, setOnlyWithPdf] = useState(false);

  const filteredPapers = useMemo(() => {
    if (!workspace) return [];
    const normalizedSearch = searchText.trim().toLowerCase();
    return workspace.papers.filter((paper) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          paper.title,
          paper.authors.join(" "),
          paper.abstract,
          paper.personalSummary,
          paper.personalNotes,
          paper.methods.join(" "),
          paper.keywords.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesYear = !selectedYear || String(paper.year ?? "") === selectedYear;
      const matchesLayer = !selectedLayerId || paper.layerIds.includes(selectedLayerId);
      const matchesCategory = !selectedCategory || paper.generalCategory === selectedCategory;
      const matchesPriority = !selectedPriority || paper.priority === selectedPriority;
      const matchesWorkflowStatus =
        !selectedWorkflowStatus || paper.workflowStatus === selectedWorkflowStatus;
      const matchesReading = !selectedReadingStatus || paper.readingStatus === selectedReadingStatus;
      const matchesPdf = !onlyWithPdf || workspaceHasPdf(paper);
      return (
        matchesSearch &&
        matchesYear &&
        matchesLayer &&
        matchesCategory &&
        matchesPriority &&
        matchesWorkflowStatus &&
        matchesReading &&
        matchesPdf
      );
    });
  }, [onlyWithPdf, searchText, selectedCategory, selectedLayerId, selectedPriority, selectedReadingStatus, selectedWorkflowStatus, selectedYear, workspace]);

  const yearOptions = useMemo(() => {
    if (!workspace) return [] as string[];
    return Array.from(new Set(workspace.papers.map((paper) => paper.year).filter((year): year is number => typeof year === "number").map(String))).sort((a, b) => Number(b) - Number(a));
  }, [workspace]);

  const layerOptions = useMemo(() => {
    if (!workspace) return [] as Array<{ id: string; name: string }>;
    return workspace.layers.map((layer) => ({ id: layer.id, name: layer.name }));
  }, [workspace]);

  const categoryOptions = useMemo(() => {
    if (!workspace) return [] as string[];
    return Array.from(new Set(workspace.papers.map((paper) => paper.generalCategory).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [workspace]);

  return {
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
  };
}
