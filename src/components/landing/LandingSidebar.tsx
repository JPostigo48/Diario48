'use client';

import React from 'react';

type Panel = 'home' | 'projects' | 'university' | 'personal' | 'about' | 'tools';

interface Props {
  activePanel: Panel;
  onNavigate: (panel: Panel) => void;
}

export default function LandingSidebar({ activePanel, onNavigate }: Props) {
  const item = (panel: Panel, label: string, dot: string, count?: string | number) => (
    <button
      key={panel}
      onClick={() => onNavigate(panel)}
      className={`flex items-center justify-between w-full px-[18px] py-2 text-[13px]
                  transition-all duration-100 border-r-2
                  ${
                    activePanel === panel
                      ? 'bg-[var(--acc2)] text-[var(--acc)] border-[var(--acc)]'
                      : 'text-[var(--tx2)] border-transparent hover:bg-[var(--bg3)] hover:text-[var(--tx)]'
                  }`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <span
          className="font-mono text-[10px] px-1.5 py-px rounded-[10px]
                     bg-[var(--bg3)] text-[var(--tx4)] border border-[var(--br)]"
        >
          {count}
        </span>
      )}
    </button>
  );

  return (
    <aside
      className="w-[220px] flex-shrink-0 border-r border-[var(--br)]
                 bg-[var(--bg2)] py-5 flex flex-col overflow-y-auto"
    >
      <SidebarSection label="plataforma">
        {item('home', 'Inicio', 'bg-[var(--acc)]')}
      </SidebarSection>

      <div className="my-2.5 h-px bg-[var(--br)]" />

      <SidebarSection label="proyectos">
        {item('projects', 'Educativos y empresariales', 'bg-[var(--green)]', 3)}
        {item('university', 'Universitarios', 'bg-[var(--purple)]', 3)}
      </SidebarSection>

      <div className="my-2.5 h-px bg-[var(--br)]" />

      <SidebarSection label="personal">
        {item('personal', 'HabitTracker', 'bg-[var(--acc)]')}
      </SidebarSection>

      <div className="my-2.5 h-px bg-[var(--br)]" />

      <SidebarSection label="herramientas">
        {item('tools', 'Graf Visualizer', 'bg-[var(--acc)]')}
        <button
          disabled
          className="flex items-center gap-2.5 w-full px-[18px] py-2 text-[13px]
                     text-[var(--tx4)] opacity-40 cursor-not-allowed"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--tx4)]" />
          Más herramientas
        </button>
      </SidebarSection>
    </aside>
  );
}

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="font-mono text-[9px] tracking-[1.8px] text-[var(--tx4)]
                   uppercase px-[18px] pb-2"
      >
        {label}
      </p>
      {children}
    </div>
  );
}
