import type { GraphTheme } from "@/lib/graph/theme";
import type {
  AlgorithmCostRow,
  AlgorithmStep,
  AlgorithmType,
} from "@/lib/graph/types";

type AlgorithmPanelProps = {
  algorithm: AlgorithmType;
  step: AlgorithmStep | null;
  theme: GraphTheme;
};

function Section({
  title,
  hint,
  theme,
  children,
}: {
  title: string;
  hint?: string;
  theme: GraphTheme;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-[10px] border p-3"
      style={{ borderColor: theme.border, backgroundColor: theme.panelSurface }}
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.04em]"
          style={{ color: theme.mutedText }}
        >
          {`// ${title}`}
        </span>
        {hint ? (
          <span className="font-mono text-[11px]" style={{ color: theme.faintText }}>
            {hint}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Chip({
  value,
  tone,
  theme,
}: {
  value: string;
  tone: "visited" | "frontier" | "path";
  theme: GraphTheme;
}) {
  const styles = {
    visited: {
      color: theme.secondaryText,
      borderColor: theme.border,
      backgroundColor: theme.panelSurfaceAlt,
    },
    frontier: {
      color: theme.path,
      borderColor: `${theme.path}55`,
      backgroundColor: theme.pathSoft,
    },
    path: {
      color: theme.goal,
      borderColor: `${theme.goal}55`,
      backgroundColor: theme.pathSoft,
    },
  } as const;

  return (
    <span
      className="rounded-[4px] border px-2 py-1 font-mono text-[12px]"
      style={styles[tone]}
    >
      {value}
    </span>
  );
}

function resolveEventTone(step: AlgorithmStep | null, theme: GraphTheme) {
  if (!step) {
    return {
      label: "espera",
      color: theme.mutedText,
      backgroundColor: theme.panelSurfaceAlt,
      borderColor: theme.border,
    };
  }

  const label = step.actionLabel.toLowerCase();
  if (label.includes("objetivo")) {
    return {
      label: "found",
      color: theme.goal,
      backgroundColor: theme.pathSoft,
      borderColor: `${theme.goal}55`,
    };
  }
  if (label.includes("procesando")) {
    return {
      label: "visit",
      color: theme.warning,
      backgroundColor: theme.warningSoft,
      borderColor: `${theme.warning}55`,
    };
  }
  if (label.includes("inicio")) {
    return {
      label: "init",
      color: theme.accent,
      backgroundColor: theme.accentSoft,
      borderColor: `${theme.accent}55`,
    };
  }
  return {
    label: "expand",
    color: theme.accent,
    backgroundColor: theme.accentSoft,
    borderColor: `${theme.accent}55`,
  };
}

export default function AlgorithmPanel({
  algorithm,
  step,
  theme,
}: AlgorithmPanelProps) {
  const tone = resolveEventTone(step, theme);
  const frontierLabel = algorithm === "dfs" ? "pila / frontera" : "cola / frontera";
  const isUniformCost = algorithm === "uniform-cost";

  return (
    <aside
      className="d48-scrollbar flex flex-col gap-3 overflow-y-auto p-3.5"
      style={{ backgroundColor: theme.panelBg }}
    >
      <section
        className="rounded-[10px] border p-4"
        style={{ borderColor: theme.border, backgroundColor: theme.panelSurface }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.04em]"
            style={{ color: theme.mutedText }}
          >
            {"// inspector"}
          </span>
          <span
            className="rounded-[4px] border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.05em]"
            style={{
              color: tone.color,
              backgroundColor: tone.backgroundColor,
              borderColor: tone.borderColor,
            }}
          >
            {tone.label}
          </span>
        </div>

        <div
          className="font-mono text-[32px] font-bold leading-none"
          style={{ color: theme.strongText }}
        >
          {step?.currentNode ?? "—"}
        </div>
        <div
          className="mt-2 font-sans text-[13px] leading-[1.55]"
          style={{ color: theme.secondaryText }}
        >
          {step?.description ??
            "Carga un ejemplo y usa la timeline superior para recorrer la simulación."}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <MetricCard
            label="procesando"
            value={step?.currentNode ?? "—"}
            theme={theme}
            accent={theme.warning}
          />
          <MetricCard
            label="paso"
            value={step ? String(step.stepNumber) : "0"}
            theme={theme}
            accent={theme.accent}
          />
          <MetricCard
            label="frontera"
            value={String(step?.frontier.length ?? 0)}
            theme={theme}
            accent={theme.path}
          />
          <MetricCard
            label="visitados"
            value={String(step?.visited.length ?? 0)}
            theme={theme}
            accent={theme.secondaryText}
          />
        </div>
      </section>

      <Section title={frontierLabel} hint={String(step?.frontier.length ?? 0)} theme={theme}>
        <div className="flex flex-wrap gap-1.5">
          {step?.frontier.length ? (
            step.frontier.map((nodeId) => (
              <Chip key={nodeId} value={nodeId} tone="frontier" theme={theme} />
            ))
          ) : (
            <span className="font-mono text-[11px]" style={{ color: theme.mutedText }}>
              vacía
            </span>
          )}
        </div>
      </Section>

      <Section title="visitados" hint={String(step?.visited.length ?? 0)} theme={theme}>
        <div className="flex flex-wrap gap-1.5">
          {step?.visited.length ? (
            step.visited.map((nodeId) => (
              <Chip key={nodeId} value={nodeId} tone="visited" theme={theme} />
            ))
          ) : (
            <span className="font-mono text-[11px]" style={{ color: theme.mutedText }}>
              sin datos
            </span>
          )}
        </div>
      </Section>

      <Section title="camino actual" hint={step?.path.length ? "final" : "—"} theme={theme}>
        <div className="flex flex-wrap gap-1.5">
          {step?.path.length ? (
            step.path.map((nodeId) => (
              <Chip key={nodeId} value={nodeId} tone="path" theme={theme} />
            ))
          ) : (
            <span className="font-mono text-[11px]" style={{ color: theme.mutedText }}>
              sin camino final · siga avanzando
            </span>
          )}
        </div>
      </Section>

      <Section
        title={`costos · ${isUniformCost ? "g(n)" : algorithm === "astar" ? "A*" : "informado"}`}
        hint={
          isUniformCost
            ? `${step?.costRows?.length ?? 0} nodos`
            : algorithm === "bfs" || algorithm === "dfs"
              ? "no aplica"
              : "pendiente"
        }
        theme={theme}
      >
        {isUniformCost ? (
          <CostTable rows={step?.costRows ?? []} theme={theme} />
        ) : (
          <div
            className="rounded-[8px] border px-3 py-2 font-mono text-[11px] leading-[1.6]"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.panelSurfaceAlt,
              color: theme.mutedText,
            }}
          >
            {algorithm === "bfs" || algorithm === "dfs"
              ? "h(n) no se requiere para este algoritmo. Esta tabla se activará en A* y Greedy."
              : "La tabla de costos quedará disponible cuando se implemente el algoritmo informado."}
          </div>
        )}
      </Section>
    </aside>
  );
}

function MetricCard({
  label,
  value,
  theme,
  accent,
}: {
  label: string;
  value: string;
  theme: GraphTheme;
  accent: string;
}) {
  return (
    <div
      className="rounded-[8px] border px-3 py-2"
      style={{ borderColor: theme.border, backgroundColor: theme.panelSurfaceAlt }}
    >
      <div className="font-mono text-[10px]" style={{ color: theme.mutedText }}>
        {label}
      </div>
      <div className="mt-1 font-mono text-[15px] font-semibold" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

function CostTable({
  rows,
  theme,
}: {
  rows: AlgorithmCostRow[];
  theme: GraphTheme;
}) {
  if (!rows.length) {
    return (
      <div
        className="rounded-[8px] border px-3 py-2 font-mono text-[11px]"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.panelSurfaceAlt,
          color: theme.mutedText,
        }}
      >
        Sin nodos descubiertos todavía.
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-[8px] border"
      style={{ borderColor: theme.border, backgroundColor: theme.panelSurfaceAlt }}
    >
      <table className="w-full border-collapse font-mono text-[11px]">
        <thead>
          <tr style={{ color: theme.mutedText }}>
            <th className="border-b px-2 py-2 text-left" style={{ borderColor: theme.border }}>
              nodo
            </th>
            <th className="border-b px-2 py-2 text-left" style={{ borderColor: theme.border }}>
              g(n)
            </th>
            <th className="border-b px-2 py-2 text-left" style={{ borderColor: theme.border }}>
              padre
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.nodeId} style={{ color: theme.strongText }}>
              <td className="border-b px-2 py-2" style={{ borderColor: `${theme.border}66` }}>
                {row.nodeId}
              </td>
              <td
                className="border-b px-2 py-2"
                style={{ borderColor: `${theme.border}66`, color: theme.accent }}
              >
                {row.g}
              </td>
              <td
                className="border-b px-2 py-2"
                style={{ borderColor: `${theme.border}66`, color: theme.secondaryText }}
              >
                {row.parent ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
