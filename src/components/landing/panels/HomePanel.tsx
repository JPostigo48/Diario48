'use client';

import GraphBackground from '@/components/landing/GraphBackground';

type Panel = 'home' | 'projects' | 'university' | 'personal' | 'about' | 'tools';

export default function HomePanel({ onNavigate }: { onNavigate: (p: Panel) => void }) {
  return (
    <div className="relative flex-1 flex flex-col justify-center px-10 py-8 bg-(--bg2) overflow-hidden">

      {/* Canvas con grafo animado */}
      <GraphBackground />

      {/* Gradiente: cubre la mitad izquierda para legibilidad del texto */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background:
            'linear-gradient(to right, var(--bg2) 0%, var(--bg2) 28%, transparent 62%)',
        }}
      />

      {/* Contenido del hero */}
      <div className="relative z-2">
        <p className="font-mono text-[11px] tracking-[2.5px] text-(--acc) uppercase mb-3">
          — plataforma personal de computación
        </p>
        <h1 className="text-[58px] font-bold leading-none tracking-[-2.5px] text-(--tx) mb-4">
          Diario<span className="text-(--acc)">48</span>
        </h1>
        <p className="text-[16px] text-(--tx2) leading-relaxed max-w-130 mb-8 font-light">
          Espacio personal donde documento proyectos reales, herramientas de computación
          y experimentos de desarrollo. Desde plataformas educativas hasta visualizadores
          de algoritmos.
        </p>
        <div className="flex gap-3 mb-9">
          <button
            onClick={() => onNavigate('projects')}
            className="font-mono text-[12px] font-bold px-5 py-2.5 rounded-md
                       bg-(--acc) text-white border-none cursor-pointer
                       hover:opacity-85 transition-opacity"
          >
            ver proyectos
          </button>
          <button
            onClick={() => onNavigate('tools')}
            className="font-mono text-[12px] px-5 py-2.5 rounded-md bg-transparent
                       text-(--tx2) border border-(--br2) cursor-pointer
                       hover:border-(--acc3) hover:text-(--acc) transition-all"
          >
            explorar herramientas
          </button>
        </div>
        <div className="flex gap-6">
          {[
            { n: '4', l: 'proyectos activos' },
            { n: '3', l: 'proyectos universitarios' },
            { n: '1', l: 'herramienta disponible' },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-mono text-[24px] font-bold text-(--acc)">{s.n}</div>
              <div className="text-[12px] text-(--tx4) mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
