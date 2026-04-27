type StepControlsProps = {
  currentStepIndex: number;
  totalSteps: number;
  canRun: boolean;
  isAutoPlaying: boolean;
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
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "run";
  disabled?: boolean;
}) {
  const baseClassName =
    "flex items-center gap-1 rounded-[4px] border px-[14px] py-[6px] font-mono text-[10px] transition-all";
  const variantClassName =
    variant === "run"
      ? "border-[#4f8ef755] bg-[#4f8ef720] font-bold text-[#4f8ef7] hover:bg-[#4f8ef733]"
      : "border-[#1a1d28] bg-transparent text-[#6b7280] hover:border-[#2a3040] hover:text-[#9ca3af]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClassName} ${variantClassName} disabled:cursor-not-allowed disabled:opacity-40`}
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
  onRun,
  onPrevious,
  onNext,
  onReset,
  onToggleAutoPlay,
}: StepControlsProps) {
  return (
    <div className="flex items-center gap-2 border-t border-[#1a1d28] bg-[#0a0b0e] px-4 py-2.5">
      <ControlButton onClick={onRun} variant="run" disabled={!canRun}>
        ▶ ejecutar
      </ControlButton>

      <div className="mx-1 h-4 w-px bg-[#1a1d28]" />

      <ControlButton onClick={onPrevious} disabled={currentStepIndex <= 0}>
        ← anterior
      </ControlButton>
      <ControlButton
        onClick={onNext}
        disabled={!canRun || currentStepIndex >= totalSteps - 1}
      >
        siguiente →
      </ControlButton>

      <div className="mx-1 h-4 w-px bg-[#1a1d28]" />

      <ControlButton onClick={onReset} disabled={!canRun}>
        ↺ reiniciar
      </ControlButton>
      <ControlButton onClick={onToggleAutoPlay} disabled={!canRun}>
        {isAutoPlaying ? "⏸ detener" : "⟳ auto-play"}
      </ControlButton>

      <div className="ml-auto font-mono text-[10px] text-[#2a3040]">
        paso{" "}
        <span className="text-[#4f8ef7]">
          {totalSteps === 0 ? 0 : currentStepIndex + 1}
        </span>{" "}
        / <span>{totalSteps}</span>
      </div>
    </div>
  );
}
