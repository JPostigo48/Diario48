export default function LandingPreview() {
  return (
    <aside className="relative flex flex-col overflow-hidden bg-[#0c0d11] p-6">
      <div className="mb-3.5 font-mono text-[9px] uppercase tracking-[1.5px] text-[#2a3040]">
        {"// preview — graph visualizer"}
      </div>

      <div className="relative flex-1">
        <svg
          className="h-[260px] w-full"
          viewBox="0 0 340 250"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="landing-arrow"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L6,3 z" fill="#2a3040" />
            </marker>
          </defs>

          {[
            [85, 60, 170, 45, "#1e2333"],
            [85, 60, 80, 140, "#1e2333"],
            [170, 45, 255, 70, "#1e2333"],
            [170, 45, 165, 135, "#1e2333"],
            [80, 140, 165, 135, "#4f8ef755"],
            [165, 135, 255, 70, "#1e2333"],
            [165, 135, 240, 190, "#4f8ef755"],
            [255, 70, 240, 190, "#1e2333"],
            [80, 140, 60, 210, "#1e2333"],
            [240, 190, 290, 210, "#1e2333"],
          ].map(([x1, y1, x2, y2, stroke], index) => (
            <line
              key={index}
              x1={Number(x1)}
              y1={Number(y1)}
              x2={Number(x2)}
              y2={Number(y2)}
              stroke={String(stroke)}
              strokeWidth={stroke === "#4f8ef755" ? 1.5 : 1.2}
              markerEnd="url(#landing-arrow)"
            />
          ))}

          {[
            { id: "A", x: 85, y: 60, fill: "#22c55e22", stroke: "#22c55e", text: "#22c55e", r: 14 },
            { id: "B", x: 170, y: 45, fill: "#22c55e22", stroke: "#22c55e", text: "#22c55e", r: 14 },
            { id: "C", x: 255, y: 70, fill: "#22c55e22", stroke: "#22c55e", text: "#22c55e", r: 14 },
            { id: "D", x: 80, y: 140, fill: "#22c55e22", stroke: "#22c55e", text: "#22c55e", r: 14 },
            { id: "E", x: 165, y: 135, fill: "#f59e0b22", stroke: "#f59e0b", text: "#f59e0b", r: 16 },
            { id: "F", x: 240, y: 190, fill: "#4f8ef722", stroke: "#4f8ef7", text: "#4f8ef7", r: 14 },
            { id: "G", x: 60, y: 210, fill: "#1e2333", stroke: "#2a3040", text: "#4b5563", r: 14 },
            { id: "H", x: 290, y: 210, fill: "#7c3aed22", stroke: "#7c3aed", text: "#a78bfa", r: 14 },
          ].map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={node.fill}
                stroke={node.stroke}
                strokeWidth={node.id === "E" ? 2 : 1.5}
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fontFamily="var(--font-jetbrains-mono)"
                fontSize="10"
                fontWeight="700"
                fill={node.text}
              >
                {node.id}
              </text>
            </g>
          ))}

          <text x="10" y="230" fontFamily="var(--font-jetbrains-mono)" fontSize="8" fill="#2a3040">
            visitado
          </text>
          <circle cx="6" cy="226" r="4" fill="#22c55e33" stroke="#22c55e" strokeWidth="1" />

          <text x="62" y="230" fontFamily="var(--font-jetbrains-mono)" fontSize="8" fill="#2a3040">
            frontera
          </text>
          <circle cx="58" cy="226" r="4" fill="#f59e0b33" stroke="#f59e0b" strokeWidth="1" />

          <text x="114" y="230" fontFamily="var(--font-jetbrains-mono)" fontSize="8" fill="#2a3040">
            objetivo
          </text>
          <circle cx="110" cy="226" r="4" fill="#7c3aed33" stroke="#7c3aed" strokeWidth="1" />

          <text x="165" y="230" fontFamily="var(--font-jetbrains-mono)" fontSize="8" fill="#2a3040">
            sin visitar
          </text>
          <circle cx="161" cy="226" r="4" fill="#1e2333" stroke="#2a3040" strokeWidth="1" />
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {[
          { value: "4", label: "algoritmos", color: "#4f8ef7" },
          { value: "8", label: "nodos · ejemplo", color: "#4f8ef7" },
          { value: "BFS", label: "disponible ahora", color: "#22c55e" },
          { value: "paso a paso", label: "visualización", color: "#4f8ef7", compact: true },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[6px] border border-[#1e2130] bg-[#111318] px-3 py-2.5"
          >
            <div
              className={`font-mono font-bold ${stat.compact ? "text-[14px]" : "text-[18px]"}`}
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="mt-0.5 font-mono text-[10px] text-[#4b5563]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
