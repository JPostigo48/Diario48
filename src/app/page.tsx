'use client';

import { useState, useEffect } from 'react';
import LandingNav from '@/components/landing/LandingNav';
import LandingSidebar from '@/components/landing/LandingSidebar';
import HomePanel from '@/components/landing/panels/HomePanel';
import ProjectsPanel from '@/components/landing/panels/ProjectsPanel';
import UniversityPanel from '@/components/landing/panels/UniversityPanel';
import PersonalPanel from '@/components/landing/panels/PersonalPanel';
import AboutPanel from '@/components/landing/panels/AboutPanel';
import ToolsRedirectPanel from '@/components/landing/panels/ToolsRedirectPanel';

type Panel = 'home' | 'projects' | 'university' | 'personal' | 'about' | 'tools';

export default function LandingPage() {
  const [panel, setPanel] = useState<Panel>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sincroniza con el tema ya aplicado por el script inline del layout
  useEffect(() => {
    const saved = localStorage.getItem('d48-theme') as 'dark' | 'light' | null;
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('d48-theme', next);
  };

  const panels: Record<Panel, React.ReactNode> = {
    home: <HomePanel onNavigate={setPanel} />,
    projects: <ProjectsPanel />,
    university: <UniversityPanel />,
    personal: <PersonalPanel />,
    about: <AboutPanel />,
    tools: <ToolsRedirectPanel />,
  };

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--bg)]">
      <LandingNav
        activePanel={panel}
        onNavigate={setPanel}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="flex-1 flex overflow-hidden">
        <LandingSidebar activePanel={panel} onNavigate={setPanel} />
        <div className="flex-1 overflow-hidden flex flex-col">{panels[panel]}</div>
      </div>
      <footer
        className="h-[38px] border-t border-[var(--br)] flex items-center
                   justify-between px-7 bg-[var(--bg2)]"
      >
        <span className="font-mono text-[10px] text-[var(--tx4)] tracking-wide">
          diario48 · plataforma personal · 2026 · v1.0
        </span>
        <div className="flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-pulse" />
          <span className="font-mono text-[10px] text-[var(--green)]">sistema activo</span>
        </div>
      </footer>
    </main>
  );
}
