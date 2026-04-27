import type { AlgorithmStep, AlgorithmType } from "@/lib/graph/types";

type AlgorithmPanelProps = {
  algorithm: AlgorithmType;
  step: AlgorithmStep | null;
};

function InfoCard({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-[6px] border border-[#1a1d28] bg-[#111318] p-3 ${className}`}>
      <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[1.5px] text-[#2a3040]">
        {title}
      </div>
      {children}
    </section>
  );
}

function NodePill({
  nodeId,
  variant,
}: {
  nodeId: string;
  variant: "visited" | "frontier" | "path";
}) {
  const styles = {
    visited: "border-[#22c55e44] bg-[#22c55e18] text-[#22c55e]",
    frontier: "border-[#f59e0b44] bg-[#f59e0b18] text-[#f59e0b]",
    path: "border-[#8b5cf644] bg-[#8b5cf618] text-[#8b5cf6]",
  };

  return (
    <span
      className={`rounded-[3px] border px-2 py-0.5 font-mono text-[10px] ${styles[variant]}`}
    >
      {nodeId}
    </span>
  );
}

export default function AlgorithmPanel({
  algorithm,
  step,
}: AlgorithmPanelProps) {
  return (
    <aside className="d48-scrollbar flex flex-col gap-2.5 overflow-y-auto bg-[#0a0b0e] p-3.5">
      <InfoCard title="// paso actual">
        <div className="font-mono text-[14px] font-medium text-[#4f8ef7]">
          {step?.actionLabel ?? "—"}
        </div>
      </InfoCard>

      <InfoCard title="// nodo procesando">
        <div className="font-mono text-[16px] font-medium text-[#ef4444]">
          {step?.currentNode ?? "—"}
        </div>
      </InfoCard>

      <InfoCard title="// visitados">
        <div className="flex flex-wrap gap-1">
          {step?.visited.length ? (
            step.visited.map((nodeId) => (
              <NodePill key={nodeId} nodeId={nodeId} variant="visited" />
            ))
          ) : (
            <span className="font-mono text-[10px] text-[#2a3040]">sin datos</span>
          )}
        </div>
      </InfoCard>

      <InfoCard title="// cola / frontera">
        <div className="flex flex-wrap gap-1">
          {step?.frontier.length ? (
            step.frontier.map((nodeId) => (
              <NodePill key={nodeId} nodeId={nodeId} variant="frontier" />
            ))
          ) : (
            <span className="font-mono text-[10px] text-[#2a3040]">vacía</span>
          )}
        </div>
      </InfoCard>

      <InfoCard title="// camino actual">
        <div className="flex flex-wrap gap-1">
          {step?.path.length ? (
            step.path.map((nodeId) => (
              <NodePill key={nodeId} nodeId={nodeId} variant="path" />
            ))
          ) : (
            <span className="font-mono text-[10px] text-[#2a3040]">sin camino final</span>
          )}
        </div>
      </InfoCard>

      <InfoCard title="// acción actual" className="flex-1">
        <p className="font-mono text-[11px] leading-[1.6] text-[#6b7280]">
          {step?.description ??
            "Carga un ejemplo y presiona ejecutar para iniciar la simulación paso a paso."}
        </p>
      </InfoCard>

      <InfoCard title={`// tabla de costos (${algorithm === "astar" ? "A*" : "A*"})`}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["nodo", "g(n)", "h(n)", "f(n)"].map((header) => (
                <th
                  key={header}
                  className="border-b border-[#1a1d28] py-1 text-center font-mono text-[9px] text-[#2a3040]"
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
                className="border-b border-[#1a1d2850] py-2 text-center font-mono text-[9px] text-[#2a3040]"
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
