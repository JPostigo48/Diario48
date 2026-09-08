import { ensureWorkspaceShape, sortLayers } from "./utils";
import type { PaperRelationType, ResearchWorkspace } from "./types";

const allowedRelationTypes = new Set<PaperRelationType>([
  "extends",
  "critiques",
  "same-dataset",
  "compares-with",
  "same-problem",
  "base-paper",
  "derived-paper",
]);

export function validateResearchWorkspaceInput(raw: unknown): {
  valid: boolean;
  data?: ResearchWorkspace;
  errors: string[];
} {
  const errors: string[] = [];

  if (!raw || typeof raw !== "object") {
    return {
      valid: false,
      errors: ["El payload debe ser un objeto válido."],
    };
  }

  const candidate = ensureWorkspaceShape(raw as Partial<ResearchWorkspace>);

  if (!candidate.project.name.trim()) {
    errors.push("El proyecto debe tener nombre.");
  }

  const layerIds = new Set<string>();
  sortLayers(candidate.layers).forEach((layer, index) => {
    if (!layer.id.trim()) {
      errors.push(`La capa #${index + 1} no tiene id.`);
    }
    if (!layer.name.trim()) {
      errors.push(`La capa #${index + 1} no tiene nombre.`);
    }
    if (layerIds.has(layer.id)) {
      errors.push(`La capa "${layer.name}" tiene id duplicado.`);
    }
    layerIds.add(layer.id);
  });

  const paperIds = new Set<string>();
  const dois = new Set<string>();
  candidate.papers.forEach((paper, index) => {
    if (!paper.id.trim()) {
      errors.push(`El paper #${index + 1} no tiene id.`);
    }
    if (!paper.title.trim()) {
      errors.push(`El paper #${index + 1} no tiene título.`);
    }
    if (paperIds.has(paper.id)) {
      errors.push(`El paper "${paper.title}" tiene id duplicado.`);
    }
    paperIds.add(paper.id);

    const normalizedDoi = paper.doi.trim().toLowerCase();
    if (normalizedDoi) {
      if (dois.has(normalizedDoi)) {
        errors.push(`El DOI "${paper.doi}" está duplicado en el workspace.`);
      }
      dois.add(normalizedDoi);
    }

    paper.layerIds.forEach((layerId) => {
      if (!layerIds.has(layerId)) {
        errors.push(`El paper "${paper.title}" referencia una capa inexistente.`);
      }
    });

    paper.structure.forEach((node) => {
      if (!node.id.trim()) {
        errors.push(`El paper "${paper.title}" tiene una sección sin id.`);
      }
      if (node.level < 1) {
        errors.push(`El paper "${paper.title}" tiene una sección con nivel inválido.`);
      }
    });
  });

  candidate.relations.forEach((relation, index) => {
    if (!relation.id.trim()) {
      errors.push(`La relación #${index + 1} no tiene id.`);
    }
    if (!paperIds.has(relation.fromPaperId) || !paperIds.has(relation.toPaperId)) {
      errors.push(`La relación #${index + 1} referencia papers inexistentes.`);
    }
    if (!allowedRelationTypes.has(relation.type)) {
      errors.push(`La relación #${index + 1} tiene un tipo inválido.`);
    }
  });

  return {
    valid: errors.length === 0,
    data: errors.length === 0 ? candidate : undefined,
    errors,
  };
}
