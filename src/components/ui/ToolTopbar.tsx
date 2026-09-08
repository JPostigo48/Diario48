import type { CSSProperties, ReactNode } from "react";

type ToolTopbarProps = {
  left: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
  style?: CSSProperties;
  leftClassName?: string;
  centerClassName?: string;
  rightClassName?: string;
  centerMode?: "grid" | "overlay";
};

export default function ToolTopbar({
  left,
  center,
  right,
  className = "",
  style,
  leftClassName = "justify-self-start min-w-0",
  centerClassName = "justify-self-center min-w-0",
  rightClassName = "justify-self-end min-w-0",
  centerMode = "grid",
}: ToolTopbarProps) {
  if (centerMode === "overlay") {
    return (
      <header
        className={`relative flex items-center justify-between gap-4 border-b px-4 py-3 ${className}`.trim()}
        style={style}
      >
        <div className={`${leftClassName} relative z-10`}>{left}</div>
        {center ? (
          <div
            className={`pointer-events-none absolute inset-0 flex items-center justify-center px-4 ${centerClassName}`.trim()}
          >
            <div className="pointer-events-auto">{center}</div>
          </div>
        ) : null}
        <div className={`${rightClassName} relative z-10`}>{right}</div>
      </header>
    );
  }

  return (
    <header
      className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b px-4 py-3 ${className}`.trim()}
      style={style}
    >
      <div className={leftClassName}>{left}</div>
      <div className={centerClassName}>{center}</div>
      <div className={rightClassName}>{right}</div>
    </header>
  );
}
