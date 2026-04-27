export type GraphThemeMode = "dark" | "light";

export type GraphTheme = {
  mode: GraphThemeMode;
  appBg: string;
  appText: string;
  border: string;
  borderSoft: string;
  panelBg: string;
  panelSurface: string;
  canvasBg: string;
  gridColor: string;
  mutedText: string;
  dimText: string;
  strongText: string;
  accent: string;
  accentSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  path: string;
  pathSoft: string;
  goal: string;
};

export const graphThemes: Record<GraphThemeMode, GraphTheme> = {
  dark: {
    mode: "dark",
    appBg: "#090a0d",
    appText: "#dde1ea",
    border: "#1a1d28",
    borderSoft: "#2a3040",
    panelBg: "#0a0b0e",
    panelSurface: "#111318",
    canvasBg: "#090a0d",
    gridColor: "rgba(26, 29, 40, 0.125)",
    mutedText: "#6b7280",
    dimText: "#2a3040",
    strongText: "#dde1ea",
    accent: "#4f8ef7",
    accentSoft: "rgba(79, 142, 247, 0.094)",
    success: "#22c55e",
    successSoft: "rgba(34, 197, 94, 0.094)",
    warning: "#f59e0b",
    warningSoft: "rgba(245, 158, 11, 0.094)",
    danger: "#ef4444",
    dangerSoft: "rgba(239, 68, 68, 0.094)",
    path: "#8b5cf6",
    pathSoft: "rgba(139, 92, 246, 0.094)",
    goal: "#a78bfa",
  },
  light: {
    mode: "light",
    appBg: "#edf3fb",
    appText: "#162033",
    border: "#ccd7e6",
    borderSoft: "#99aac3",
    panelBg: "#f7fbff",
    panelSurface: "#ffffff",
    canvasBg: "#f2f7ff",
    gridColor: "rgba(191, 208, 230, 0.125)",
    mutedText: "#5d6b81",
    dimText: "#7b8aa3",
    strongText: "#142033",
    accent: "#2563eb",
    accentSoft: "rgba(37, 99, 235, 0.078)",
    success: "#16a34a",
    successSoft: "rgba(22, 163, 74, 0.071)",
    warning: "#d97706",
    warningSoft: "rgba(217, 119, 6, 0.078)",
    danger: "#dc2626",
    dangerSoft: "rgba(220, 38, 38, 0.071)",
    path: "#7c3aed",
    pathSoft: "rgba(124, 58, 237, 0.071)",
    goal: "#8b5cf6",
  },
};
