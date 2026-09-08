"use client";

import Link from "next/link";
import AuthStatusControls from "@/components/auth/AuthStatusControls";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import ToolTopbar from "@/components/ui/ToolTopbar";
import { useThemeMode } from "@/components/ui/useThemeMode";

export default function ResearchEmptyPage() {
  const { theme, toggleTheme } = useThemeMode();

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[var(--bg)] text-[var(--tx)]">
      <ToolTopbar
        className="border-[var(--br)] bg-[var(--bg2)]"
        left={
          <Link
            href="/"
            className="font-mono text-[17px] font-bold no-underline transition-opacity hover:opacity-75"
          >
            Diario<span className="text-[var(--acc)]">48</span>
            <span className="mx-2 text-[14px] font-normal text-[var(--tx4)]">/</span>
            <span className="text-[13px] font-normal text-[var(--tx3)]">Papers Review</span>
          </Link>
        }
        right={
          <div className="flex items-center gap-2">
            <AuthStatusControls variant="tool" nextPath="/tools/papers-review" />
            <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
          </div>
        }
      />

      <section className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[720px] rounded-[14px] border border-[var(--br)] bg-[var(--bg2)] p-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--tx4)]">
            {"// vista vacía"}
          </p>
          <h1 className="mt-3 font-mono text-[24px] font-semibold text-[var(--tx)]">
            Papers Review
          </h1>
          <p className="mt-3 text-[14px] leading-[1.7] text-[var(--tx3)]">
            Puedes entrar a la herramienta sin iniciar sesión. Para crear workspaces, guardar
            cambios o abrir los tuyos en modo edición, inicia sesión.
          </p>
        </div>
      </section>
    </main>
  );
}
