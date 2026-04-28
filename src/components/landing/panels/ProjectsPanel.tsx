import ProjectCard from '@/components/ui/ProjectCard';
import { PROJECTS } from '@/lib/data/projects';
import React from 'react';

export default function ProjectsPanel() {
  const educational = PROJECTS.filter((p) => p.category === 'educational');
  const enterprise = PROJECTS.filter((p) => p.category === 'enterprise');

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-7 py-5 border-b border-[var(--br)] bg-[var(--bg2)]">
        <p className="font-mono text-[10px] tracking-[2px] text-[var(--acc)] uppercase mb-1">
          // proyectos
        </p>
        <h2 className="text-[26px] font-bold text-[var(--tx)] tracking-tight">Proyectos</h2>
        <p className="text-[14px] text-[var(--tx3)] leading-relaxed mt-1 max-w-[560px]">
          Plataformas y aplicaciones desarrolladas para instituciones educativas y empresas.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-7 py-5">
        <SubTitle>// educativos</SubTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5 mb-6">
          {educational.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
        <SubTitle>// empresariales</SubTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
          {enterprise.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-[10px] tracking-[1.5px] text-[var(--tx4)]
                 uppercase mb-3 pb-2 border-b border-[var(--br)]"
    >
      {children}
    </p>
  );
}
