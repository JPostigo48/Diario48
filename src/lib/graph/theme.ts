export type GraphThemeMode = "dark" | "light";

export type GraphTheme = {
  mode: GraphThemeMode;
  appBg: string;
  appBgDeep: string;
  appText: string;
  border: string;
  borderSoft: string;
  borderStrong: string;
  panelBg: string;
  panelSurface: string;
  panelSurfaceAlt: string;
  canvasBg: string;
  gridColor: string;
  gridColorStrong: string;
  mutedText: string;
  secondaryText: string;
  dimText: string;
  faintText: string;
  strongText: string;
  accent: string;
  accentSoft: string;
  start: string;
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
    appBg: "#0B0E14",
    appBgDeep: "#070A10",
    appText: "#E6EAF2",
    border: "#232B3A",
    borderSoft: "#232B3A",
    borderStrong: "#2F3848",
    panelBg: "#141822",
    panelSurface: "#1A1F2B",
    panelSurfaceAlt: "#1F2632",
    canvasBg: "#0B0E14",
    gridColor: "rgba(180, 189, 205, 0.05)",
    gridColorStrong: "rgba(180, 189, 205, 0.08)",
    mutedText: "#7A8499",
    secondaryText: "#B4BDCD",
    dimText: "#4F5A70",
    faintText: "#4F5A70",
    strongText: "#E6EAF2",
    accent: "#5D8EFF",
    accentSoft: "rgba(93, 142, 255, 0.15)",
    start: "#8B5CF6",
    success: "#22c55e",
    successSoft: "rgba(34, 197, 94, 0.16)",
    warning: "#E5B74A",
    warningSoft: "rgba(229, 183, 74, 0.14)",
    danger: "#ef4444",
    dangerSoft: "rgba(239, 68, 68, 0.14)",
    path: "#46D38A",
    pathSoft: "rgba(70, 211, 138, 0.18)",
    goal: "#46D38A",
  },
  light: {
    mode: "light",
    appBg: "#F8F9FD",
    appBgDeep: "#F0F3FA",
    appText: "#1A1F2E",
    border: "#DCE1EE",
    borderSoft: "#DCE1EE",
    borderStrong: "#C8D0E2",
    panelBg: "#FFFFFF",
    panelSurface: "#F6F8FE",
    panelSurfaceAlt: "#EEF2FB",
    canvasBg: "#F4F7FF",
    gridColor: "rgba(40, 48, 80, 0.04)",
    gridColorStrong: "rgba(40, 48, 80, 0.07)",
    mutedText: "#6C7690",
    secondaryText: "#44506A",
    dimText: "#97A1B8",
    faintText: "#A7AFC4",
    strongText: "#1A1F2E",
    accent: "#2D63D7",
    accentSoft: "rgba(45, 99, 215, 0.10)",
    start: "#7B61D9",
    success: "#16a34a",
    successSoft: "rgba(22, 163, 74, 0.12)",
    warning: "#C78B1F",
    warningSoft: "rgba(199, 139, 31, 0.12)",
    danger: "#dc2626",
    dangerSoft: "rgba(220, 38, 38, 0.12)",
    path: "#22A861",
    pathSoft: "rgba(34, 168, 97, 0.14)",
    goal: "#22A861",
  },
};
