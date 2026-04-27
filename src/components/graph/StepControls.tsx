import type { GraphTheme } from "@/lib/graph/theme";

type StepControlsProps = {
  currentStepIndex: number;
  totalSteps: number;
  canRun: boolean;
  isAutoPlaying: boolean;
  theme: GraphTheme;
  onRun: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  onSelectStep: (index: number) => void;
  onToggleAutoPlay: () => void;
};

function ControlButton({
  children,
  onClick,
  variant = "default",
  disabled = false,
  theme,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "run";
  disabled?: boolean;
  theme: GraphTheme;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1 rounded-[6px] border px-3 py-2 font-mono text-[11px] transition-all disabled:cursor-not-allowed disabled:opacity-40"
      style={
        variant === "run"
          ? {
              borderColor: theme.accent,
              backgroundColor: theme.accent,
              color: "#ffffff",
            }
          : {
              borderColor: theme.border,
              backgroundColor: theme.panelSurface,
              color: theme.strongText,
            }
      }
    >
      {children}
    </button>
  );
}

export default function StepControls({
  currentStepIndex,
  totalSteps,
  canRun,
  isAutoPlaying,
  theme,
  onRun,
  onPrevious,
  onNext,
  onReset,
  onSelectStep,
  onToggleAutoPlay,
}: StepControlsProps) {
  const displayStep = totalSteps === 0 ? 0 : currentStepIndex + 1;

  return (
    <div
      className="border-t px-4 py-3"
      style={{ borderColor: theme.border, backgroundColor: theme.panelBg }}
    >
      <div className="flex items-center gap-2">
        <ControlButton onClick={onRun} variant="run" disabled={!canRun} theme={theme}>
          ▶ ejecutar
        </ControlButton>
        <ControlButton onClick={onPrevious} disabled={currentStepIndex <= 0} theme={theme}>
          ← anterior
        </ControlButton>
        <ControlButton
          onClick={onNext}
          disabled={!canRun || currentStepIndex >= totalSteps - 1}
          theme={theme}
        >
          siguiente →
        </ControlButton>
        <ControlButton onClick={onReset} disabled={!canRun} theme={theme}>
          ↺ reiniciar
        </ControlButton>
        <ControlButton onClick={onToggleAutoPlay} disabled={!canRun} theme={theme}>
          {isAutoPlaying ? "⏸ detener" : "⟳ auto-play"}
        </ControlButton>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <input
          type="range"
          min={0}
          max={Math.max(totalSteps - 1, 0)}
          value={Math.min(currentStepIndex, Math.max(totalSteps - 1, 0))}
          onChange={(event) => onSelectStep(Number(event.target.value))}
          disabled={!canRun}
          className="flex-1 disabled:opacity-40"
          style={{ accentColor: theme.accent }}
        />

        <div
          className="min-w-[132px] text-right font-mono text-[11px]"
          style={{ color: theme.secondaryText }}
        >
          paso <span style={{ color: theme.accent, fontWeight: 700 }}>{displayStep}</span> /{" "}
          {totalSteps}
        </div>

        <div className="font-mono text-[10px]" style={{ color: theme.mutedText }}>
          atajos: <span style={{ color: theme.strongText }}>← →</span> ·{" "}
          <span style={{ color: theme.strongText }}>Enter</span> ·{" "}
          <span style={{ color: theme.strongText }}>Supr</span>
        </div>
      </div>
    </div>
  );
}
