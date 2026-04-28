import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

type Panel = 'home' | 'projects' | 'university' | 'personal' | 'about' | 'tools';

interface Props {
  activePanel: Panel;
  onNavigate: (p: Panel) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const navItems: { panel: Panel; label: string }[] = [
  { panel: 'home', label: 'inicio' },
  { panel: 'projects', label: 'proyectos' },
  { panel: 'personal', label: 'desarrollo personal' },
  { panel: 'about', label: 'sobre mí' },
];

export default function LandingNav({ activePanel, onNavigate, theme, onToggleTheme }: Props) {
  return (
    <nav className="h-12.5 flex items-center justify-between px-7 border-b border-(--br) bg-(--bg2)">
      <div className="font-mono text-[17px] font-bold text-(--tx)">
        Diario<span className="text-(--acc)">48</span>
      </div>

      <div className="flex gap-7">
        {navItems.map(({ panel, label }) => (
          <button
            key={panel}
            onClick={() => onNavigate(panel)}
            className={`font-mono text-[13px] tracking-wide bg-transparent border-none
                        cursor-pointer transition-colors
                        ${activePanel === panel
                          ? 'text-(--acc)'
                          : 'text-(--tx3) hover:text-(--acc)'
                        }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ThemeSwitcher theme={theme} onToggle={onToggleTheme} />
    </nav>
  );
}
