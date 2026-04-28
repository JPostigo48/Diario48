export default function PersonalPanel() {
  const features = [
    'Organización de finanzas personales',
    'Horarios y rutinas diarias',
    'Seguimiento de hábitos con racha',
    'Metas y objetivos personales',
  ];
  const stack = [
    'Next.js + TypeScript',
    'MongoDB',
    'Tailwind + shadcn/ui',
    'Charts para progreso',
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-7 py-5 border-b border-[var(--br)] bg-[var(--bg2)]">
        <p className="font-mono text-[10px] tracking-[2px] text-[var(--acc)] uppercase mb-1">
          // desarrollo personal
        </p>
        <h2 className="text-[26px] font-bold text-[var(--tx)] tracking-tight">
          Desarrollo personal
        </h2>
        <p className="text-[14px] text-[var(--tx3)] leading-relaxed mt-1 max-w-[560px]">
          Herramientas para organizar, medir y mejorar hábitos, finanzas y rutinas personales.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-7 py-5">
        <div className="grid grid-cols-2 gap-4">
          <div
            className="col-span-2 bg-[var(--acc2)] border border-[var(--acc3)]
                       rounded-[10px] p-[18px]"
          >
            <h3 className="text-[16px] font-semibold text-[var(--acc)] mb-1">HabitTracker</h3>
            <p className="text-[13px] text-[var(--tx2)] leading-relaxed max-w-[500px]">
              Sistema personal unificado de seguimiento de hábitos, finanzas y rutinas. Un
              espacio para construir consistencia y medir progreso de forma honesta.
            </p>
            <div className="flex gap-2.5 mt-3 flex-wrap">
              {features.map((f) => (
                <span
                  key={f}
                  className="font-mono text-[11px] px-3 py-1.5 rounded
                             bg-[var(--bg2)] border border-[var(--br2)]
                             text-[var(--tx2)]"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg2)] border border-[var(--br)] rounded-[10px] p-[18px]">
            <h4 className="text-[15px] font-semibold text-[var(--tx)] mb-2">Estado actual</h4>
            <p className="text-[13px] text-[var(--tx3)] leading-relaxed mb-3">
              En fase de diseño. La idea es un espacio unificado para lo que más importa.
            </p>
            <ul className="flex flex-col gap-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[13px] text-[var(--tx2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--acc)] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--bg2)] border border-[var(--br)] rounded-[10px] p-[18px]">
            <h4 className="text-[15px] font-semibold text-[var(--tx)] mb-2">Stack planeado</h4>
            <ul className="flex flex-col gap-2">
              {stack.map((s) => (
                <li key={s} className="flex items-center gap-2 text-[13px] text-[var(--tx2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--acc)] flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
