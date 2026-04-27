import type { GraphTheme } from "@/lib/graph/theme";
import type { AlgorithmStep, AlgorithmType } from "@/lib/graph/types";

type AlgorithmPanelProps = {
  algorithm: AlgorithmType;
  step: AlgorithmStep | null;
  theme: GraphTheme;
};

function InfoCard({
  title,
  theme,
  className = "",
  children,
}: {
  title: string;
  theme: GraphTheme;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[6px] border p-3 ${className}`}
      style={{ borderColor: theme.border, backgroundColor: theme.panelSurface }}
    >
      <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px]" style={{ color: theme.dimText }}>
        {title}
      </div>
      {children}
    </section>
  );
}

function NodePill({
  nodeId,
  variant,
  theme,
}: {
  nodeId: string;
  variant: "visited" | "frontier" | "path";
  theme: GraphTheme;
}) {
  const styles = {
    visited: {
      borderColor: `${theme.success}44`,
      backgroundColor: theme.successSoft,
      color: theme.success,
    },
    frontier: {
      borderColor: `${theme.warning}44`,
      backgroundColor: theme.warningSoft,
      color: theme.warning,
    },
    path: {
      borderColor: `${theme.path}44`,
      backgroundColor: theme.pathSoft,
      color: theme.path,
    },
  };

  return (
    <span className="rounded-[3px] border px-2 py-0.5 font-mono text-[10px]" style={styles[variant]}>
      {nodeId}
    </span>
  );
}

export default function AlgorithmPanel({
  algorithm,
  step,
  theme,
}: AlgorithmPanelProps) {
  return (
    <aside className="d48-scrollbar flex flex-col gap-2.5 overflow-y-auto p-3.5" style={{ backgroundColor: theme.panelBg }}>
      <InfoCard title="// paso actual" theme={theme}>
        <div className="font-mono text-[14px] font-medium" style={{ color: theme.accent }}>
          {step?.actionLabel ?? "—"}
        </div>
      </InfoCard>

      <InfoCard title="// nodo procesando" theme={theme}>
        <div className="font-mono text-[16px] font-medium" style={{ color: theme.danger }}>
          {step?.currentNode ?? "—"}
        </div>
      </InfoCard>

      <InfoCard title="// visitados" theme={theme}>
        <div className="flex flex-wrap gap-1">
          {step?.visited.length ? (
            step.visited.map((nodeId) => (
              <NodePill key={nodeId} nodeId={nodeId} variant="visited" theme={theme} />
            ))
          ) : (
            <span className="font-mono text-[10px]" style={{ color: theme.dimText }}>sin datos</span>
          )}
        </div>
      </InfoCard>

      <InfoCard title="// cola / frontera" theme={theme}>
        <div className="flex flex-wrap gap-1">
          {step?.frontier.length ? (
            step.frontier.map((nodeId) => (
              <NodePill key={nodeId} nodeId={nodeId} variant="frontier" theme={theme} />
            ))
          ) : (
            <span className="font-mono text-[10px]" style={{ color: theme.dimText }}>vacía</span>
          )}
        </div>
      </InfoCard>

      <InfoCard title="// camino actual" theme={theme}>
        <div className="flex flex-wrap gap-1">
          {step?.path.length ? (
            step.path.map((nodeId) => (
              <NodePill key={nodeId} nodeId={nodeId} variant="path" theme={theme} />
            ))
          ) : (
            <span className="font-mono text-[10px]" style={{ color: theme.dimText }}>sin camino final</span>
          )}
        </div>
      </InfoCard>

      <InfoCard title="// acción actual" theme={theme} className="flex-1">
        <p className="font-mono text-[11px] leading-[1.6]" style={{ color: theme.mutedText }}>
          {step?.description ??
            "Carga un ejemplo y presiona ejecutar para iniciar la simulación paso a paso."}
        </p>
      </InfoCard>

      <InfoCard title={`// tabla de costos (${algorithm === "astar" ? "A*" : "A*"})`} theme={theme}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["nodo", "g(n)", "h(n)", "f(n)"].map((header) => (
                <th
                  key={header}
                  className="border-b py-1 text-center font-mono text-[9px]"
                  style={{ borderColor: theme.border, color: theme.dimText }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={4}
                className="border-b py-2 text-center font-mono text-[9px]"
                style={{ borderColor: `${theme.border}80`, color: theme.dimText }}
              >
                — disponible cuando se implemente A* —
              </td>
            </tr>
          </tbody>
        </table>
      </InfoCard>
    </aside>
  );
}
