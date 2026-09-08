"use client";

import Link from "next/link";
import AuthStatusControls from "@/components/auth/AuthStatusControls";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import ToolTopbar from "@/components/ui/ToolTopbar";
import { useThemeMode } from "@/components/ui/useThemeMode";
import { graphThemes } from "@/lib/graph/theme";

export default function GraphEmptyPage() {
  const { theme: themeMode, toggleTheme } = useThemeMode();
  const theme = graphThemes[themeMode];

  return (
    <main
      className="flex h-screen w-screen flex-col overflow-hidden border"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.appBgDeep,
        color: theme.appText,
      }}
    >
      <ToolTopbar
        style={{ borderColor: theme.border, backgroundColor: theme.panelBg }}
        left={
          <Link
            href="/"
            className="font-mono text-[17px] font-bold transition-opacity hover:opacity-75"
            style={{ color: theme.strongText, textDecoration: "none" }}
          >
            Diario<span style={{ color: theme.accent }}>48</span>
            <span
              style={{
                color: theme.faintText,
                margin: "0 8px",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              /
            </span>
            <span
              style={{
                color: theme.mutedText,
                fontSize: "13px",
                fontWeight: 400,
              }}
            >
              Graph Visualizer
            </span>
          </Link>
        }
        right={
          <div className="flex items-center gap-2">
            <AuthStatusControls variant="tool" nextPath="/tools/graphs" />
            <ThemeSwitcher theme={themeMode} onToggle={toggleTheme} />
          </div>
        }
      />

      <section className="flex flex-1 items-center justify-center p-6">
        <div
          className="w-full max-w-[720px] rounded-[14px] border p-8 text-center"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.panelSurface,
          }}
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.08em]"
            style={{ color: theme.mutedText }}
          >
            {"// vista vacía"}
          </p>
          <h1
            className="mt-3 font-mono text-[24px] font-semibold"
            style={{ color: theme.strongText }}
          >
            Graph Visualizer
          </h1>
          <p className="mt-3 text-[14px] leading-[1.7]" style={{ color: theme.secondaryText }}>
            Puedes explorar la herramienta sin iniciar sesión. Para guardar, editar tus recursos o
            abrir uno propio, entra con tu cuenta.
          </p>
        </div>
      </section>
    </main>
  );
}
