import type { StylesheetJsonBlock } from "cytoscape";
import type { GraphData } from "./types";

export function buildCytoscapeStyles(graph: GraphData) {
  const goalId = graph.goalNode;

  const styles: StylesheetJsonBlock[] = [
    {
      selector: "node",
      style: {
        label: "data(label)",
        width: 38,
        height: 38,
        color: "#4b5563",
        "font-family": "var(--font-jetbrains-mono)",
        "font-size": 12,
        "font-weight": 700,
        "text-valign": "center",
        "text-halign": "center",
        "background-color": "#1e2333",
        "border-width": 1.8,
        "border-color": "#2a3040",
      },
    },
    {
      selector: "edge",
      style: {
        width: 1.8,
        label: "data(weightLabel)",
        color: "#4b5563",
        "font-family": "var(--font-jetbrains-mono)",
        "font-size": 9,
        "text-background-color": "#090a0d",
        "text-background-opacity": 1,
        "text-background-padding": "2px",
        "curve-style": "bezier",
        "line-color": "#1e2333",
        "target-arrow-color": "#1e2333",
        "target-arrow-shape": "triangle",
      },
    },
    {
      selector: ".node-unvisited",
      style: {
        "background-color": "#1e2333",
        "border-color": "#2a3040",
        color: "#4b5563",
      },
    },
    {
      selector: ".node-current",
      style: {
        "background-color": "#ef444420",
        "border-color": "#ef4444",
        color: "#ef4444",
      },
    },
    {
      selector: ".node-visited",
      style: {
        "background-color": "#22c55e20",
        "border-color": "#22c55e",
        color: "#22c55e",
      },
    },
    {
      selector: ".node-frontier",
      style: {
        "background-color": "#f59e0b20",
        "border-color": "#f59e0b",
        color: "#f59e0b",
      },
    },
    {
      selector: ".node-path",
      style: {
        "background-color": "#8b5cf620",
        "border-color": "#8b5cf6",
        color: "#8b5cf6",
      },
    },
    {
      selector: ".edge-normal",
      style: {
        "line-color": "#1e2333",
        "target-arrow-color": "#1e2333",
      },
    },
    {
      selector: ".edge-explored",
      style: {
        "line-color": "#4f8ef7",
        "target-arrow-color": "#4f8ef7",
      },
    },
    {
      selector: ".edge-path",
      style: {
        width: 2.4,
        "line-color": "#8b5cf6",
        "target-arrow-color": "#8b5cf6",
      },
    },
  ];

  if (goalId) {
    styles.push({
      selector: `node[id = "${goalId}"]`,
      style: {
        "border-style": "double",
        "border-color": "#a78bfa",
        "border-width": 2.4,
      },
    });
  }

  return styles;
}
