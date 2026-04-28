const skills = [
  { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { label: 'Backend', items: ['Node.js', 'MongoDB', 'REST APIs', 'Next.js API Routes'] },
  { label: 'Algoritmos', items: ['BFS', 'DFS', 'A*', 'Uniform Cost Search'] },
  { label: 'Herramientas', items: ['Git', 'Cytoscape.js', 'Mongoose', 'Vercel'] },
];

const timeline = [
  { year: '2024', event: 'Inicio del desarrollo de plataformas educativas' },
  { year: '2024', event: 'ciencias.edu.pe y nextlevel.edu.pe — lanzados' },
  { year: '2025', event: 'Diario48 — plataforma personal de documentación' },
  { year: '2025', event: 'Graf Visualizer — primera herramienta interna' },
];

export default function AboutPanel() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-7 py-5 border-b border-[var(--br)] bg-[var(--bg2)]">
        <p className="font-mono text-[10px] tracking-[2px] text-[var(--acc)] uppercase mb-1">
          // sobre mí
        </p>
        <h2 className="text-[26px] font-bold text-[var(--tx)] tracking-tight">Sobre mí</h2>
        <p className="text-[14px] text-[var(--tx3)] leading-relaxed mt-1 max-w-[560px]">
          Estudiante de ingeniería de software, desarrollador y constructor de herramientas
          computacionales.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-7 py-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Bio */}
          <div
            className="col-span-2 bg-[var(--bg2)] border border-[var(--br)]
                       rounded-[10px] p-[18px]"
          >
            <h3 className="text-[15px] font-semibold text-[var(--tx)] mb-2">Juan Postigo</h3>
            <p className="text-[13px] text-[var(--tx3)] leading-relaxed max-w-[600px]">
              Construyo plataformas educativas, herramientas de visualización y sistemas de
              gestión. Diario48 es mi espacio para documentar ese proceso — proyectos reales,
              experimentos computacionales y aprendizaje continuo.
            </p>
          </div>

          {/* Skills */}
          <div className="bg-[var(--bg2)] border border-[var(--br)] rounded-[10px] p-[18px]">
            <h4 className="text-[15px] font-semibold text-[var(--tx)] mb-3">Stack</h4>
            <div className="flex flex-col gap-3">
              {skills.map((group) => (
                <div key={group.label}>
                  <p className="font-mono text-[10px] tracking-[1.5px] text-[var(--tx4)] uppercase mb-1.5">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-[10px] px-2 py-0.5 rounded
                                   bg-[var(--bg3)] text-[var(--tx2)] border border-[var(--br)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[var(--bg2)] border border-[var(--br)] rounded-[10px] p-[18px]">
            <h4 className="text-[15px] font-semibold text-[var(--tx)] mb-3">Timeline</h4>
            <div className="flex flex-col gap-3">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-mono text-[11px] text-[var(--acc)] w-[34px] flex-shrink-0 pt-px">
                    {item.year}
                  </span>
                  <div className="flex gap-2 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--br2)] flex-shrink-0 mt-1" />
                    <span className="text-[13px] text-[var(--tx3)]">{item.event}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
