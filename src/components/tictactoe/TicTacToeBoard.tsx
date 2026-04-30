"use client";

import type { Board, TicTacToeMove } from "@/lib/tictactoe/types";

type TicTacToeBoardProps = {
  board: Board;
  disabled: boolean;
  onCellClick: (move: TicTacToeMove) => void;
};

export default function TicTacToeBoard({
  board,
  disabled,
  onCellClick,
}: TicTacToeBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isFilled = cell !== null;

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              onClick={() => onCellClick({ row: rowIndex, col: colIndex })}
              disabled={disabled || isFilled}
              className={`aspect-square rounded-[18px] border text-[42px] font-semibold transition-all ${
                disabled || isFilled
                  ? "cursor-default"
                  : "cursor-pointer hover:-translate-y-[1px]"
              }`}
              style={{
                borderColor: "var(--br)",
                backgroundColor: "var(--bg2)",
                color:
                  cell === "X"
                    ? "var(--acc)"
                    : cell === "O"
                      ? "var(--purple)"
                      : "var(--tx)",
                boxShadow: isFilled ? "inset 0 0 0 1px var(--acc3)" : "none",
              }}
            >
              {cell}
            </button>
          );
        }),
      )}
    </div>
  );
}
