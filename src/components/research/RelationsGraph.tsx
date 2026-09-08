"use client";

import type { PaperRelation, ResearchPaper } from "@/lib/research/types";

type RelationsGraphProps = {
  papers: ResearchPaper[];
  relations: PaperRelation[];
  selectedPaperId: string | null;
};

export default function RelationsGraph({
  papers,
  relations,
  selectedPaperId,
}: RelationsGraphProps) {
  const visiblePapers = papers.slice(0, 10);
  const nodes = visiblePapers.map((paper, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(visiblePapers.length, 1);
    return {
      ...paper,
      x: 150 + Math.cos(angle) * 110,
      y: 150 + Math.sin(angle) * 110,
    };
  });

  const visibleIds = new Set(nodes.map((node) => node.id));
  const visibleRelations = relations.filter(
    (relation) => visibleIds.has(relation.fromPaperId) && visibleIds.has(relation.toPaperId),
  );

  return (
    <div className="rounded-[18px] border border-[var(--br)] bg-[var(--bg2)] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--tx3)]">
            relaciones
          </div>
          <div className="text-[13px] text-[var(--tx2)]">
            Vista simple tipo red para detectar papers base, extensiones y comparaciones.
          </div>
        </div>
        <div className="text-[11px] text-[var(--tx3)]">
          {visibleRelations.length} enlaces · {nodes.length} nodos
        </div>
      </div>

      {nodes.length ? (
        <svg viewBox="0 0 300 300" className="h-[320px] w-full rounded-[14px] bg-[var(--bg3)]">
          {visibleRelations.map((relation) => {
            const from = nodes.find((node) => node.id === relation.fromPaperId);
            const to = nodes.find((node) => node.id === relation.toPaperId);

            if (!from || !to) {
              return null;
            }

            return (
              <g key={relation.id}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="var(--br2)"
                  strokeWidth="1.5"
                />
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2}
                  fill="var(--tx3)"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {relation.type}
                </text>
              </g>
            );
          })}

          {nodes.map((node) => {
            const isActive = node.id === selectedPaperId;

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 22 : 18}
                  fill={isActive ? "var(--acc2)" : "var(--bg2)"}
                  stroke={isActive ? "var(--acc)" : "var(--br2)"}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <text
                  x={node.x}
                  y={node.y + 3}
                  fill="var(--tx)"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {node.title.slice(0, 10)}
                </text>
              </g>
            );
          })}
        </svg>
      ) : (
        <div className="rounded-[14px] border border-dashed border-[var(--br2)] bg-[var(--bg3)] px-3 py-8 text-center text-[12px] text-[var(--tx3)]">
          Agrega papers y relaciones manuales para ver una red simple aquí.
        </div>
      )}
    </div>
  );
}
