"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import AlgorithmSelector from "./AlgorithmSelector";
import TicTacToeBoard from "./TicTacToeBoard";
import {
  applyMove,
  createEmptyBoard,
  getNextPlayer,
  getWinner,
  isDraw,
} from "@/lib/tictactoe/gameState";
import type {
  AlgorithmType,
  Player,
  TicTacToeEngineResponse,
  TicTacToeMove,
} from "@/lib/tictactoe/types";

export default function TicTacToePage() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const saved = window.localStorage.getItem("d48-theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("minimax");
  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [humanPlayer] = useState<Player>("X");
  const [aiPlayer] = useState<Player>("O");
  const [statusMessage, setStatusMessage] = useState(
    "Haz tu jugada. El backend llamará al engine y de ahí a tu archivo del algoritmo.",
  );
  const [isThinking, setIsThinking] = useState(false);

  const winner = useMemo(() => getWinner(board), [board]);
  const draw = useMemo(() => isDraw(board), [board]);

  const applyTheme = (nextTheme: "dark" | "light") => {
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("d48-theme", nextTheme);
  };

  const toggleTheme = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer("X");
    setIsThinking(false);
    setStatusMessage("Tablero reiniciado. Haz tu jugada.");
  };

  const requestAiMove = async (nextBoard: ReturnType<typeof createEmptyBoard>) => {
    setIsThinking(true);
    setStatusMessage(`Consultando ${algorithm} en backend...`);

    try {
      const response = await fetch("/api/tictactoe/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board: nextBoard,
          algorithm,
          currentPlayer: aiPlayer,
          aiPlayer,
          humanPlayer,
        }),
      });

      const payload = (await response.json()) as {
        data?: TicTacToeEngineResponse;
        error?: string;
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error || "No se pudo obtener la jugada de la IA.");
      }

      setBoard(payload.data.board);
      setCurrentPlayer(humanPlayer);

      if (payload.data.winner) {
        setStatusMessage(`La IA ganó con ${payload.data.winner}.`);
        return;
      }

      if (payload.data.isDraw) {
        setStatusMessage("Empate. No quedan movimientos disponibles.");
        return;
      }

      if (payload.data.move) {
        setStatusMessage(
          `La IA jugó en fila ${payload.data.move.row + 1}, columna ${payload.data.move.col + 1}. Tu turno.`,
        );
      } else {
        setStatusMessage("La IA no devolvió un movimiento. Revisa tu algoritmo.");
      }
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "No se pudo consultar el backend.",
      );
    } finally {
      setIsThinking(false);
    }
  };

  const handleCellClick = async (move: TicTacToeMove) => {
    if (isThinking || winner || draw || currentPlayer !== humanPlayer) {
      return;
    }

    try {
      const nextBoard = applyMove(board, move, humanPlayer);
      setBoard(nextBoard);

      const nextWinner = getWinner(nextBoard);
      if (nextWinner) {
        setStatusMessage(`Ganaste con ${nextWinner}.`);
        return;
      }

      if (isDraw(nextBoard)) {
        setStatusMessage("Empate. No quedan movimientos disponibles.");
        return;
      }

      setCurrentPlayer(getNextPlayer(humanPlayer));
      await requestAiMove(nextBoard);
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "No se pudo aplicar tu jugada.",
      );
    }
  };

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--bg)]">
      <header className="flex items-center justify-between border-b border-[var(--br)] bg-[var(--bg2)] px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-mono text-[12px] text-[var(--tx3)] transition-colors hover:text-[var(--tx)]"
          >
            ← volver
          </Link>
          <div className="font-mono text-[15px] font-bold text-[var(--tx)]">
            Diario<span className="text-[var(--acc)]">48</span>
            <span className="mx-2 text-[var(--tx4)]">/</span>
            <span className="text-[12px] font-normal text-[var(--tx2)]">
              tic-tac-toe ai
            </span>
          </div>
        </div>

        <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
      </header>

      <section className="grid flex-1 grid-cols-[320px_1fr] overflow-hidden">
        <aside className="d48-scrollbar overflow-y-auto border-r border-[var(--br)] bg-[var(--bg2)] p-5">
          <div className="mb-5">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-[var(--acc)]">
              {"// configuración"}
            </p>
            <h1 className="text-[26px] font-bold tracking-tight text-[var(--tx)]">
              Tic-Tac-Toe
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--tx2)]">
              Tú te encargas de la lógica en <code>minimax.ts</code> y <code>alphaBeta.ts</code>.
              Esta pantalla solo te da el tablero y el selector para probar las cuatro variantes.
            </p>
          </div>

          <div className="rounded-[14px] border border-[var(--br)] bg-[var(--bg3)] p-4">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--tx3)]">
              algoritmo
            </div>
            <AlgorithmSelector value={algorithm} onChange={setAlgorithm} />
          </div>

          <div className="mt-4 rounded-[14px] border border-[var(--br)] bg-[var(--bg3)] p-4">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--tx3)]">
              estado
            </div>
            <div className="space-y-2 text-[13px] text-[var(--tx2)]">
              <p>
                Humano: <span className="font-mono text-[var(--tx)]">{humanPlayer}</span>
              </p>
              <p>
                IA: <span className="font-mono text-[var(--tx)]">{aiPlayer}</span>
              </p>
              <p>
                Turno actual:{" "}
                <span className="font-mono text-[var(--tx)]">
                  {winner ? "finalizado" : draw ? "empate" : currentPlayer}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetGame}
            className="mt-4 w-full rounded-[12px] border border-[var(--acc3)] bg-[var(--acc2)] px-4 py-3 font-mono text-[12px] font-semibold text-[var(--tx)] transition-opacity hover:opacity-90"
          >
            reiniciar partida
          </button>

        </aside>

        <div className="flex min-h-0 items-center justify-center bg-[var(--bg)] px-8 py-8">
          <div className="w-full max-w-[560px]">
            <div className="mb-5 rounded-[14px] border border-[var(--br)] bg-[var(--bg2)] px-4 py-3">
              <p className="text-[14px] leading-relaxed text-[var(--tx2)]">
                {statusMessage}
              </p>
            </div>

            <div className="rounded-[24px] border border-[var(--br)] bg-[var(--bg3)] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.16)]">
              <TicTacToeBoard
                board={board}
                disabled={isThinking || Boolean(winner) || draw}
                onCellClick={handleCellClick}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
