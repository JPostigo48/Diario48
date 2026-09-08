"use client";

import { useMemo, useState } from "react";
import {
  createEmptyMetric,
  createEmptyRelation,
  createEmptyStructureNode,
  priorityOptions,
  readingStatusOptions,
  relationTypeOptions,
  workflowStatusOptions,
} from "@/lib/research/defaults";
import { normalizeTextList, normalizeStructureNode } from "@/lib/research/utils";
import type {
  PaperMetric,
  PaperRelation,
  PaperSectionNode,
  ResearchLayer,
  ResearchPaper,
} from "@/lib/research/types";

type PaperFormModalProps = {
  mode: "paper" | "relation";
  paper?: ResearchPaper | null;
  relation?: PaperRelation | null;
  papers: ResearchPaper[];
  layers: ResearchLayer[];
  onClose: () => void;
  onSavePaper: (paper: ResearchPaper) => void;
  onSaveRelation: (relation: PaperRelation) => void;
};

export default function PaperFormModal({
  mode,
  paper,
  relation,
  papers,
  layers,
  onClose,
  onSavePaper,
  onSaveRelation,
}: PaperFormModalProps) {
  const [draftPaper, setDraftPaper] = useState<ResearchPaper | null>(paper ?? null);
  const [draftRelation, setDraftRelation] = useState<PaperRelation>(
    relation ?? createEmptyRelation(),
  );
  const [authorsInput, setAuthorsInput] = useState(() => paper?.authors.join(", ") ?? "");
  const [keywordsInput, setKeywordsInput] = useState(() => paper?.keywords.join(", ") ?? "");

  const modalTitle = useMemo(() => {
    if (mode === "relation") {
      return relation ? "Editar relación" : "Nueva relación";
    }

    return paper?.title ? "Editar paper" : "Agregar paper";
  }, [mode, paper, relation]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-5 py-6">
      <div className="d48-scrollbar max-h-full w-full max-w-[1100px] overflow-y-auto rounded-[22px] border border-[var(--br)] bg-[var(--bg2)] shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--br)] bg-[var(--bg2)] px-5 py-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[2px] text-[var(--acc)]">
              {"// editor"}
            </div>
            <h3 className="mt-1 text-[22px] font-semibold text-[var(--tx)]">{modalTitle}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] border border-[var(--br)] px-3 py-2 font-mono text-[11px] text-[var(--tx2)]"
          >
            cerrar
          </button>
        </div>

        {mode === "paper" && draftPaper ? (
          <div className="grid gap-4 p-5 lg:grid-cols-2">
            <Field label="Título">
              <input
                value={draftPaper.title}
                onChange={(event) =>
                  setDraftPaper({ ...draftPaper, title: event.target.value })
                }
                className={inputClassName}
              />
            </Field>

            <Field label="Autores (separados por coma)">
              <input
                value={authorsInput}
                onChange={(event) => setAuthorsInput(event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label="Año">
              <input
                value={draftPaper.year ? String(draftPaper.year) : ""}
                onChange={(event) =>
                  setDraftPaper({
                    ...draftPaper,
                    year: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
                className={inputClassName}
                type="number"
              />
            </Field>

            <Field label="Venue / revista / conferencia">
              <input
                value={draftPaper.venue}
                onChange={(event) =>
                  setDraftPaper({ ...draftPaper, venue: event.target.value })
                }
                className={inputClassName}
              />
            </Field>

            <Field label="DOI">
              <input
                value={draftPaper.doi}
                onChange={(event) => setDraftPaper({ ...draftPaper, doi: event.target.value })}
                className={inputClassName}
              />
            </Field>

            <Field label="Link del paper">
              <input
                value={draftPaper.paperUrl}
                onChange={(event) =>
                  setDraftPaper({ ...draftPaper, paperUrl: event.target.value })
                }
                className={inputClassName}
              />
            </Field>

            <Field label="Link directo al PDF">
              <input
                value={draftPaper.pdfUrl}
                onChange={(event) =>
                  setDraftPaper({ ...draftPaper, pdfUrl: event.target.value })
                }
                className={inputClassName}
              />
            </Field>

            <Field label="Palabras clave (coma)">
              <input
                value={keywordsInput}
                onChange={(event) => setKeywordsInput(event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label="Categoría general">
              <input
                value={draftPaper.generalCategory}
                onChange={(event) =>
                  setDraftPaper({
                    ...draftPaper,
                    generalCategory: event.target.value,
                  })
                }
                className={inputClassName}
              />
            </Field>

            <Field label="Subcategoría">
              <input
                value={draftPaper.subcategory}
                onChange={(event) =>
                  setDraftPaper({ ...draftPaper, subcategory: event.target.value })
                }
                className={inputClassName}
              />
            </Field>

            <Field label="Prioridad">
              <select
                value={draftPaper.priority}
                onChange={(event) =>
                  setDraftPaper({
                    ...draftPaper,
                    priority: event.target.value as ResearchPaper["priority"],
                  })
                }
                className={inputClassName}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Estado de lectura">
              <select
                value={draftPaper.readingStatus}
                onChange={(event) =>
                  setDraftPaper({
                    ...draftPaper,
                    readingStatus: event.target.value as ResearchPaper["readingStatus"],
                  })
                }
                className={inputClassName}
              >
                {readingStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Fase metodológica">
              <select
                value={draftPaper.workflowStatus}
                onChange={(event) =>
                  setDraftPaper({
                    ...draftPaper,
                    workflowStatus: event.target.value as ResearchPaper["workflowStatus"],
                  })
                }
                className={inputClassName}
              >
                {workflowStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Capas asignadas" className="lg:col-span-2">
              <div className="grid gap-2 rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] p-3 sm:grid-cols-2 xl:grid-cols-3">
                {layers.map((layer) => {
                  const checked = draftPaper.layerIds.includes(layer.id);

                  return (
                    <label key={layer.id} className="flex items-center gap-2 text-[12px] text-[var(--tx2)]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          setDraftPaper({
                            ...draftPaper,
                            layerIds: event.target.checked
                              ? [...draftPaper.layerIds, layer.id]
                              : draftPaper.layerIds.filter((id) => id !== layer.id),
                          })
                        }
                      />
                      {layer.name}
                    </label>
                  );
                })}
              </div>
            </Field>

            <TextAreaField label="Abstract" value={draftPaper.abstract} onChange={(value) => setDraftPaper({ ...draftPaper, abstract: value })} />
            <TextAreaField label="Resumen personal" value={draftPaper.personalSummary} onChange={(value) => setDraftPaper({ ...draftPaper, personalSummary: value })} />
            <TextAreaField label="Objetivo del paper" value={draftPaper.objective} onChange={(value) => setDraftPaper({ ...draftPaper, objective: value })} />
            <TextAreaField label="Utilidad para mi investigación" value={draftPaper.researchUsefulness} onChange={(value) => setDraftPaper({ ...draftPaper, researchUsefulness: value })} />
            <TextAreaField label="Notas personales" value={draftPaper.personalNotes} onChange={(value) => setDraftPaper({ ...draftPaper, personalNotes: value })} />

            <StringListField
              label="Métodos"
              values={draftPaper.methods}
              onChange={(values) => setDraftPaper({ ...draftPaper, methods: values })}
              className="lg:col-span-2"
            />
            <StringListField
              label="Datasets"
              values={draftPaper.datasets}
              onChange={(values) => setDraftPaper({ ...draftPaper, datasets: values })}
              className="lg:col-span-2"
            />
            <StringListField
              label="Limitaciones"
              values={draftPaper.limitations}
              onChange={(values) => setDraftPaper({ ...draftPaper, limitations: values })}
              className="lg:col-span-2"
            />
            <StringListField
              label="Desafíos futuros"
              values={draftPaper.futureChallenges}
              onChange={(values) => setDraftPaper({ ...draftPaper, futureChallenges: values })}
              className="lg:col-span-2"
            />

            <MetricListField
              metrics={draftPaper.performanceMetrics}
              onChange={(metrics) =>
                setDraftPaper({ ...draftPaper, performanceMetrics: metrics })
              }
              className="lg:col-span-2"
            />

            <PaperStructureField
              value={draftPaper.structure}
              onChange={(structure) => setDraftPaper({ ...draftPaper, structure })}
              className="lg:col-span-2"
            />
          </div>
        ) : null}

        {mode === "relation" ? (
          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {/* Relaciones entre papers quedan despriorizadas por ahora.
                Se conserva el modal para una futura reactivación. */}
            <Field label="Paper origen">
              <select
                value={draftRelation.fromPaperId}
                onChange={(event) =>
                  setDraftRelation({ ...draftRelation, fromPaperId: event.target.value })
                }
                className={inputClassName}
              >
                <option value="">Selecciona un paper</option>
                {papers.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Paper destino">
              <select
                value={draftRelation.toPaperId}
                onChange={(event) =>
                  setDraftRelation({ ...draftRelation, toPaperId: event.target.value })
                }
                className={inputClassName}
              >
                <option value="">Selecciona un paper</option>
                {papers.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tipo de relación">
              <select
                value={draftRelation.type}
                onChange={(event) =>
                  setDraftRelation({
                    ...draftRelation,
                    type: event.target.value as PaperRelation["type"],
                  })
                }
                className={inputClassName}
              >
                {relationTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <TextAreaField
              label="Nota sobre la relación"
              value={draftRelation.note ?? ""}
              onChange={(value) => setDraftRelation({ ...draftRelation, note: value })}
              className="lg:col-span-2"
            />
          </div>
        ) : null}

        <div className="flex justify-end gap-3 border-t border-[var(--br)] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] border border-[var(--br)] px-4 py-2 text-[12px] text-[var(--tx2)]"
          >
            cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              if (mode === "paper" && draftPaper) {
                onSavePaper({
                  ...draftPaper,
                  authors: normalizeTextList(authorsInput),
                  keywords: normalizeTextList(keywordsInput),
                  methods: draftPaper.methods.map((item) => item.trim()).filter(Boolean),
                  datasets: draftPaper.datasets.map((item) => item.trim()).filter(Boolean),
                  limitations: draftPaper.limitations.map((item) => item.trim()).filter(Boolean),
                  futureChallenges: draftPaper.futureChallenges.map((item) => item.trim()).filter(Boolean),
                  performanceMetrics: draftPaper.performanceMetrics
                    .map((metric) => ({
                      ...metric,
                      name: metric.name.trim(),
                      value: metric.value.trim(),
                      unit: metric.unit.trim(),
                      observation: metric.observation.trim(),
                    }))
                    .filter(
                      (metric) =>
                        metric.name || metric.value || metric.unit || metric.observation,
                    ),
                  structure: draftPaper.structure
                    .map((node) => normalizeStructureNode(node))
                    .filter(
                      (node) => node.title || node.notes || node.children.length > 0,
                    ),
                });
              }

              if (mode === "relation") {
                onSaveRelation(draftRelation);
              }
            }}
            className="rounded-[12px] border border-[var(--acc3)] bg-[var(--acc2)] px-4 py-2 font-mono text-[11px] text-[var(--tx)]"
          >
            guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--tx3)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="d48-scrollbar min-h-[132px] w-full resize-y rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[13px] text-[var(--tx)] outline-none"
      />
    </Field>
  );
}

function StringListField({
  label,
  values,
  onChange,
  className = "",
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
}) {
  const safeValues = values.length ? values : [""];

  return (
    <Field label={label} className={className}>
      <div className="space-y-2 rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] p-3">
        {safeValues.map((value, index) => (
          <div key={`${label}-${index}`} className="flex gap-2">
            <input
              value={value}
              onChange={(event) => {
                const next = [...safeValues];
                next[index] = event.target.value;
                onChange(next);
              }}
              className={inputClassName}
            />
            <button
              type="button"
              className="rounded-[10px] border border-[var(--br)] px-3 py-2 text-[11px] text-[var(--tx3)]"
              onClick={() => {
                const next = safeValues.filter((_, itemIndex) => itemIndex !== index);
                onChange(next.length ? next : [""]);
              }}
            >
              quitar
            </button>
          </div>
        ))}

        <button
          type="button"
          className="rounded-[10px] border border-[var(--acc3)] bg-[var(--acc2)] px-3 py-2 font-mono text-[10px] text-[var(--tx)]"
          onClick={() => onChange([...safeValues, ""])}
        >
          agregar ítem
        </button>
      </div>
    </Field>
  );
}

function MetricListField({
  metrics,
  onChange,
  className = "",
}: {
  metrics: PaperMetric[];
  onChange: (metrics: PaperMetric[]) => void;
  className?: string;
}) {
  const safeMetrics = metrics.length ? metrics : [createEmptyMetric()];

  return (
    <Field label="Métricas / performance" className={className}>
      <div className="space-y-3 rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] p-3">
        {safeMetrics.map((metric, index) => (
          <div key={metric.id} className="rounded-[12px] border border-[var(--br)] bg-[var(--bg2)] p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-mono text-[10px] text-[var(--tx3)]">métrica {index + 1}</div>
              <button
                type="button"
                className="rounded-[8px] border border-[var(--br)] px-2 py-1 text-[10px] text-[var(--tx3)]"
                onClick={() => {
                  const next = safeMetrics.filter((item) => item.id !== metric.id);
                  onChange(next.length ? next : [createEmptyMetric()]);
                }}
              >
                quitar
              </button>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <input
                value={metric.name}
                onChange={(event) => {
                  const next = safeMetrics.map((item) =>
                    item.id === metric.id ? { ...item, name: event.target.value } : item,
                  );
                  onChange(next);
                }}
                className={inputClassName}
                placeholder="nombre de la métrica"
              />
              <input
                value={metric.value}
                onChange={(event) => {
                  const next = safeMetrics.map((item) =>
                    item.id === metric.id ? { ...item, value: event.target.value } : item,
                  );
                  onChange(next);
                }}
                className={inputClassName}
                placeholder="valor"
              />
              <input
                value={metric.unit}
                onChange={(event) => {
                  const next = safeMetrics.map((item) =>
                    item.id === metric.id ? { ...item, unit: event.target.value } : item,
                  );
                  onChange(next);
                }}
                className={inputClassName}
                placeholder="unidad"
              />
              <input
                value={metric.observation}
                onChange={(event) => {
                  const next = safeMetrics.map((item) =>
                    item.id === metric.id
                      ? { ...item, observation: event.target.value }
                      : item,
                  );
                  onChange(next);
                }}
                className={inputClassName}
                placeholder="observación"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className="rounded-[10px] border border-[var(--acc3)] bg-[var(--acc2)] px-3 py-2 font-mono text-[10px] text-[var(--tx)]"
          onClick={() => onChange([...safeMetrics, createEmptyMetric()])}
        >
          agregar métrica
        </button>
      </div>
    </Field>
  );
}

function PaperStructureField({
  value,
  onChange,
  className = "",
}: {
  value: PaperSectionNode[];
  onChange: (value: PaperSectionNode[]) => void;
  className?: string;
}) {
  const safeValue = value.length ? value : [createEmptyStructureNode(1)];

  const updateNode = (
    nodes: PaperSectionNode[],
    targetId: string,
    updater: (node: PaperSectionNode) => PaperSectionNode,
  ): PaperSectionNode[] =>
    nodes.map((node) =>
      node.id === targetId
        ? updater(node)
        : { ...node, children: updateNode(node.children, targetId, updater) },
    );

  const removeNode = (nodes: PaperSectionNode[], targetId: string): PaperSectionNode[] =>
    nodes
      .filter((node) => node.id !== targetId)
      .map((node) => ({ ...node, children: removeNode(node.children, targetId) }));

  const addChild = (
    nodes: PaperSectionNode[],
    targetId: string,
    level: number,
  ): PaperSectionNode[] =>
    nodes.map((node) =>
      node.id === targetId
        ? {
            ...node,
            children: [...node.children, createEmptyStructureNode(level + 1)],
          }
        : { ...node, children: addChild(node.children, targetId, level) },
    );

  return (
    <Field label="Estructura del paper" className={className}>
      <div className="space-y-3 rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] p-3">
        <div className="text-[12px] text-[var(--tx3)]">
          Registra secciones, subsecciones y notas internas del artículo.
        </div>
        <StructureNodeEditor
          nodes={safeValue}
          onUpdateNode={(nodeId, updater) => onChange(updateNode(safeValue, nodeId, updater))}
          onRemoveNode={(nodeId) => {
            const next = removeNode(safeValue, nodeId);
            onChange(next.length ? next : [createEmptyStructureNode(1)]);
          }}
          onAddChild={(nodeId, level) => onChange(addChild(safeValue, nodeId, level))}
        />
        <button
          type="button"
          className="rounded-[10px] border border-[var(--acc3)] bg-[var(--acc2)] px-3 py-2 font-mono text-[10px] text-[var(--tx)]"
          onClick={() => onChange([...safeValue, createEmptyStructureNode(1)])}
        >
          agregar sección raíz
        </button>
      </div>
    </Field>
  );
}

function StructureNodeEditor({
  nodes,
  onUpdateNode,
  onRemoveNode,
  onAddChild,
  depth = 0,
}: {
  nodes: PaperSectionNode[];
  onUpdateNode: (nodeId: string, updater: (node: PaperSectionNode) => PaperSectionNode) => void;
  onRemoveNode: (nodeId: string) => void;
  onAddChild: (nodeId: string, level: number) => void;
  depth?: number;
}) {
  return (
    <div className="space-y-3">
      {nodes.map((node) => (
        <div
          key={node.id}
          className="rounded-[12px] border border-[var(--br)] bg-[var(--bg2)] p-3"
          style={{ marginLeft: depth * 20 }}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="font-mono text-[10px] text-[var(--tx3)]">
              nivel {node.level}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-[8px] border border-[var(--br)] px-2 py-1 text-[10px] text-[var(--tx3)]"
                onClick={() => onAddChild(node.id, node.level)}
              >
                agregar sub-sección
              </button>
              <button
                type="button"
                className="rounded-[8px] border border-[var(--br)] px-2 py-1 text-[10px] text-[var(--tx3)]"
                onClick={() => onRemoveNode(node.id)}
              >
                quitar
              </button>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-[1fr_120px]">
            <input
              value={node.title}
              onChange={(event) =>
                onUpdateNode(node.id, (current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className={inputClassName}
              placeholder="título de la sección"
            />
            <label className="flex items-center gap-2 text-[11px] text-[var(--tx2)]">
              <input
                type="checkbox"
                checked={node.highlight}
                onChange={(event) =>
                  onUpdateNode(node.id, (current) => ({
                    ...current,
                    highlight: event.target.checked,
                  }))
                }
              />
              me interesa
            </label>
          </div>
          <textarea
            value={node.notes}
            onChange={(event) =>
              onUpdateNode(node.id, (current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            className="mt-2 min-h-[84px] w-full resize-y rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[12px] text-[var(--tx)] outline-none"
            placeholder="qué contiene esta sección, observaciones, por qué importa..."
          />

          {node.children.length ? (
            <div className="mt-3">
              <StructureNodeEditor
                nodes={node.children}
                onUpdateNode={onUpdateNode}
                onRemoveNode={onRemoveNode}
                onAddChild={onAddChild}
                depth={depth + 1}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

const inputClassName =
  "w-full rounded-[12px] border border-[var(--br)] bg-[var(--bg3)] px-3 py-2 text-[13px] text-[var(--tx)] outline-none";





