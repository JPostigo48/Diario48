"use client";

import type { AlgorithmType } from "@/lib/tictactoe/types";

const options: Array<{ value: AlgorithmType; label: string; hint: string }> = [
  { value: "minimax", label: "Minimax", hint: "normal" },
  { value: "minimax-professor", label: "Minimax", hint: "consigna profe" },
  { value: "alpha-beta", label: "Alpha-Beta", hint: "normal" },
  { value: "alpha-beta-professor", label: "Alpha-Beta", hint: "consigna profe" },
];

type AlgorithmSelectorProps = {
  value: AlgorithmType;
  onChange: (value: AlgorithmType) => void;
};

export default function AlgorithmSelector({
  value,
  onChange,
}: AlgorithmSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className="rounded-[12px] border px-3 py-3 text-left transition-all"
            style={{
              borderColor: isActive ? "var(--acc3)" : "var(--br)",
              backgroundColor: isActive ? "var(--acc2)" : "var(--bg2)",
              color: isActive ? "var(--tx)" : "var(--tx2)",
            }}
          >
            <div className="font-mono text-[12px] font-semibold">{option.label}</div>
            <div className="mt-1 text-[12px]" style={{ color: "var(--tx3)" }}>
              {option.hint}
            </div>
          </button>
        );
      })}
    </div>
  );
}
