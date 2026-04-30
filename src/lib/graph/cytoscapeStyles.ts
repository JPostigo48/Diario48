import type { StylesheetJsonBlock } from "cytoscape";
import { graphThemes, type GraphThemeMode } from "./theme";
import type { GraphData } from "./types";

export function buildCytoscapeStyles(
  graph: GraphData,
  mode: GraphThemeMode = "dark",
) {
  const startId = graph.startNode;
  const goalId = graph.goalNode;
  const theme = graphThemes[mode];

  const styles: StylesheetJsonBlock[] = [
    {
      selector: "node",
      style: {
        label: "data(label)",
        width: 38,
        height: 38,
        color: theme.strongText,
        "font-family": "JetBrains Mono, monospace",
        "font-size": 10.5,
        "font-weight": 700,
        "text-valign": "center",
        "text-halign": "center",
        "background-color": theme.border,
        "border-width": 1.8,
        "border-color": theme.borderSoft,
      },
    },
    {
      selector: "edge",
      style: {
        width: 1.8,
        label: "data(weightLabel)",
        color: theme.mutedText,
        "font-family": "JetBrains Mono, monospace",
        "font-size": 9,
        "text-background-color": theme.canvasBg,
        "text-background-opacity": 1,
        "text-background-padding": "2px",
        "curve-style": "bezier",
        "line-color": theme.border,
        "target-arrow-color": theme.border,
        "target-arrow-shape": graph.isDirected ? "triangle" : "none",
      },
    },
    {
      selector: ".node-unvisited",
      style: {
        "background-color": theme.border,
        "border-color": theme.borderSoft,
        color: theme.strongText,
      },
    },
    {
      selector: ".node-current",
      style: {
        "background-color": theme.dangerSoft,
        "border-color": theme.danger,
        color: theme.strongText,
      },
    },
    {
      selector: ".node-visited",
      style: {
        "background-color": theme.accentSoft,
        "border-color": theme.accent,
        color: theme.strongText,
      },
    },
    {
      selector: ".node-frontier",
      style: {
        "background-color": theme.warningSoft,
        "border-color": theme.warning,
        color: theme.strongText,
      },
    },
    {
      selector: ".node-path",
      style: {
        "background-color": theme.pathSoft,
        "border-color": theme.path,
        color: theme.strongText,
      },
    },
    {
      selector: ".edge-normal",
      style: {
        "line-color": theme.border,
        "target-arrow-color": theme.border,
      },
    },
    {
      selector: ".edge-explored",
      style: {
        "line-color": theme.accent,
        "target-arrow-color": theme.accent,
      },
    },
    {
      selector: ".edge-path",
      style: {
        width: 2.4,
        "line-color": theme.path,
        "target-arrow-color": theme.path,
      },
    },
    {
      selector: "node.is-selected",
      style: {
        "border-width": 3,
        "border-color": theme.accent,
      },
    },
    {
      selector: "edge.is-selected",
      style: {
        width: 3.2,
        "line-color": theme.accent,
        "target-arrow-color": theme.accent,
      },
    },
  ];

  if (startId) {
    styles.push({
      selector: `node[id = "${startId}"]`,
      style: {
        "border-color": theme.start,
        "border-width": 2.4,
      },
    });
  }

  if (goalId) {
    styles.push({
      selector: `node[id = "${goalId}"]`,
      style: {
        "border-style": "double",
        "border-color": theme.goal,
        "border-width": 2.4,
      },
    });
  }

  return styles;
}
