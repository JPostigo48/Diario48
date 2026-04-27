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
      className="flex items-center gap-1 rounded-[4px] border px-[14px] py-[6px] font-mono text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-40"
      style={
        variant === "run"
          ? {
              borderColor: `${theme.accent}55`,
              backgroundColor: theme.accentSoft,
              color: theme.accent,
            }
          : {
              borderColor: theme.border,
              color: theme.mutedText,
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
  onToggleAutoPlay,
}: StepControlsProps) {
  return (
    <div
      className="flex items-center gap-2 border-t px-4 py-2.5"
      style={{ borderColor: theme.border, backgroundColor: theme.panelBg }}
    >
      <ControlButton onClick={onRun} variant="run" disabled={!canRun} theme={theme}>
        ▶ ejecutar
      </ControlButton>

      <div className="mx-1 h-4 w-px" style={{ backgroundColor: theme.border }} />

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

      <div className="mx-1 h-4 w-px" style={{ backgroundColor: theme.border }} />

      <ControlButton onClick={onReset} disabled={!canRun} theme={theme}>
        ↺ reiniciar
      </ControlButton>
      <ControlButton onClick={onToggleAutoPlay} disabled={!canRun} theme={theme}>
        {isAutoPlaying ? "⏸ detener" : "⟳ auto-play"}
      </ControlButton>

      <div className="ml-auto font-mono text-[10px]" style={{ color: theme.dimText }}>
        paso <span style={{ color: theme.accent }}>{totalSteps === 0 ? 0 : currentStepIndex + 1}</span> / <span>{totalSteps}</span>
      </div>
    </div>
  );
}
