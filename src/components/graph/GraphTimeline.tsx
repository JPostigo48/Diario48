import type { GraphTheme } from "@/lib/graph/theme";
import type { AlgorithmStep, AlgorithmType } from "@/lib/graph/types";

type GraphTimelineProps = {
  algorithm: AlgorithmType;
  steps: AlgorithmStep[];
  currentStepIndex: number;
  theme: GraphTheme;
  onSelectStep: (index: number) => void;
};

type TimelineEventType = "init" | "visit" | "enqueue" | "expand" | "found" | "done";

function resolveTimelineEventType(
  step: AlgorithmStep,
  previousStep?: AlgorithmStep,
): TimelineEventType {
  const label = step.actionLabel.toLowerCase();
  const description = step.description.toLowerCase();

  if (label.includes("inicio")) return "init";
  if (label.includes("objetivo encontrado")) return "found";
  if (label.includes("finalizada")) return "done";
  if (label.includes("procesando")) return "visit";
  if (description.includes("se agregan a la cola")) return "enqueue";

  if (previousStep && step.frontier.length > previousStep.frontier.length) {
    return "enqueue";
  }

  return "expand";
}

function getEventMeta(type: TimelineEventType, theme: GraphTheme) {
  switch (type) {
    case "init":
      return { color: theme.dimText, icon: "◯", label: "init" };
    case "visit":
      return { color: theme.warning, icon: "●", label: "visitar" };
    case "enqueue":
      return { color: theme.path, icon: "+", label: "encolar" };
    case "expand":
      return { color: theme.accent, icon: "↳", label: "expandir" };
    case "found":
      return { color: theme.goal, icon: "★", label: "meta" };
    case "done":
      return { color: theme.secondaryText, icon: "■", label: "fin" };
  }
}

export default function GraphTimeline({
  algorithm,
  steps,
  currentStepIndex,
  theme,
  onSelectStep,
}: GraphTimelineProps) {
  if (!steps.length) {
    return (
      <div
        className="border-b px-5 py-3"
        style={{ borderColor: theme.border, backgroundColor: theme.panelBg }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span
              className="font-mono text-[11px] uppercase tracking-[0.04em]"
              style={{ color: theme.mutedText }}
            >
              {"// timeline"}
            </span>
            <span className="font-mono text-[13px]" style={{ color: theme.dimText }}>
              carga un ejemplo para visualizar la secuencia del algoritmo
            </span>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = Math.min(currentStepIndex, steps.length - 1);
  const currentStep = steps[currentIndex];
  const currentPercent =
    steps.length <= 1 ? 0 : (currentIndex / (steps.length - 1)) * 100;

  const eventTypes = Array.from(
    new Set(steps.map((step, index) => resolveTimelineEventType(step, steps[index - 1]))),
  ) as TimelineEventType[];

  return (
    <div
      className="border-b px-5 py-3"
      style={{ borderColor: theme.border, backgroundColor: theme.panelBg }}
    >
      <div className="mb-2 flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.04em]"
            style={{ color: theme.mutedText }}
          >
            {`// timeline · ${algorithm}`}
          </span>
          <span className="font-mono text-[13px]" style={{ color: theme.strongText }}>
            paso{" "}
            <span style={{ color: theme.accent, fontWeight: 700 }}>
              {currentStep.stepNumber}
            </span>
            <span style={{ color: theme.faintText }}> / {steps.length}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {eventTypes.map((eventType) => {
            const meta = getEventMeta(eventType, theme);
            return (
              <span
                key={eventType}
                className="inline-flex items-center gap-1 font-mono text-[11px]"
                style={{ color: theme.mutedText }}
              >
                <span style={{ color: meta.color, fontSize: 13 }}>{meta.icon}</span>
                {meta.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="relative h-[58px] overflow-hidden">
        <div
          className="absolute left-0 right-0 top-[28px] h-px"
          style={{ backgroundColor: theme.border }}
        />
        <div
          className="absolute bottom-0 top-0 z-[1] w-[2px] -translate-x-1/2"
          style={{
            left: `${currentPercent}%`,
            backgroundColor: theme.accent,
          }}
        />

        {steps.map((step, index) => {
          const left = steps.length <= 1 ? 0 : (index / (steps.length - 1)) * 100;
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;
          const meta = getEventMeta(
            resolveTimelineEventType(step, steps[index - 1]),
            theme,
          );

          return (
            <button
              key={`${step.stepNumber}-${step.actionLabel}`}
              type="button"
              onClick={() => onSelectStep(index)}
              className="absolute top-0 z-[2] flex -translate-x-1/2 flex-col items-center gap-[2px] outline-none"
              style={{
                left: `${left}%`,
                opacity: isPast || isCurrent ? 1 : 0.36,
              }}
              title={`${step.stepNumber}. ${step.actionLabel}`}
            >
              <span
                className="font-mono text-[10px]"
                style={{
                  color: isCurrent ? theme.strongText : theme.faintText,
                  visibility: isCurrent || index % 4 === 0 ? "visible" : "hidden",
                }}
              >
                {step.stepNumber}
              </span>

              <span
                className="block rounded-full border-[2px]"
                style={{
                  width: isCurrent ? 14 : 10,
                  height: isCurrent ? 14 : 10,
                  marginTop: 20 - (isCurrent ? 7 : 5),
                  backgroundColor: isPast || isCurrent ? meta.color : theme.panelBg,
                  borderColor: meta.color,
                  boxShadow: isCurrent ? `0 0 0 4px ${theme.accentSoft}` : "none",
                }}
              />

              <span
                className="max-w-[72px] truncate font-mono text-[10px]"
                style={{
                  color: isCurrent ? theme.strongText : theme.mutedText,
                  visibility: isCurrent || index % 4 === 0 ? "visible" : "hidden",
                }}
              >
                {step.currentNode ?? meta.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between gap-4 font-mono text-[11px]">
        <span style={{ color: theme.secondaryText }}>{currentStep.actionLabel}</span>
        <span style={{ color: theme.mutedText }}>{currentStep.description}</span>
      </div>
    </div>
  );
}
