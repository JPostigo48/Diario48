import Link from 'next/link';
import { UNIVERSITY_PROJECTS } from '@/lib/data/projects';
import StatusBadge from '@/components/ui/StatusBadge';

export default function UniversityPanel() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-7 py-5 border-b border-[var(--br)] bg-[var(--bg2)]">
        <p className="font-mono text-[10px] tracking-[2px] text-[var(--acc)] uppercase mb-1">
          // universidad
        </p>
        <h2 className="text-[26px] font-bold text-[var(--tx)] tracking-tight">
          Proyectos universitarios
        </h2>
        <p className="text-[14px] text-[var(--tx3)] leading-relaxed mt-1 max-w-[560px]">
          Trabajos y herramientas desarrolladas en el contexto académico. Computación aplicada.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-7 py-5">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
          {UNIVERSITY_PROJECTS.map((p) => (
            <div
              key={p.id}
              className="bg-[var(--bg2)] border border-[var(--br)] rounded-[8px] p-[14px]
                         flex flex-col gap-2 hover:border-[var(--acc3)] transition-colors"
            >
              <span
                className="font-mono text-[11px] px-2 py-0.5 rounded
                           bg-[var(--acc2)] border border-[var(--acc3)]
                           text-[var(--acc)] w-fit"
              >
                {p.id.split('-')[0]}
              </span>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[13px] font-semibold text-[var(--tx)]">{p.name}</h3>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-[11px] text-[var(--tx3)] leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] px-1.5 py-px rounded
                               bg-[var(--bg3)] text-[var(--tx4)] border border-[var(--br)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {p.internalRoute && (
                <Link
                  href={p.internalRoute}
                  className="font-mono text-[11px] text-[var(--acc)]
                             hover:opacity-70 transition-opacity mt-1"
                >
                  abrir herramienta →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
