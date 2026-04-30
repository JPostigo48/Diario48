import { NextResponse } from "next/server";
import {
  createEmptyBoard,
  getAvailableMoves,
  getWinner,
  isBoardFull,
} from "@/lib/tictactoe/gameState";
import { runTicTacToeEngine } from "@/lib/tictactoe/engine";
import type {
  AlgorithmType,
  Board,
  Player,
  TicTacToeEngineRequest,
} from "@/lib/tictactoe/types";

export const dynamic = "force-dynamic";

function isPlayer(value: unknown): value is Player {
  return value === "X" || value === "O";
}

function isAlgorithm(value: unknown): value is AlgorithmType {
  return (
    value === "minimax" ||
    value === "minimax-professor" ||
    value === "alpha-beta" ||
    value === "alpha-beta-professor"
  );
}

function isBoard(value: unknown): value is Board {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (row) =>
        Array.isArray(row) &&
        row.length === 3 &&
        row.every((cell) => cell === null || cell === "X" || cell === "O"),
    )
  );
}

function validatePayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "El cuerpo de la solicitud es inválido." };
  }

  const candidate = payload as Partial<TicTacToeEngineRequest>;

  if (!isBoard(candidate.board)) {
    return { valid: false, error: "El tablero debe ser una matriz 3x3 válida." };
  }

  if (!isAlgorithm(candidate.algorithm)) {
    return { valid: false, error: "El algoritmo solicitado no es válido." };
  }

  if (!isPlayer(candidate.currentPlayer) || !isPlayer(candidate.aiPlayer) || !isPlayer(candidate.humanPlayer)) {
    return { valid: false, error: "Los jugadores deben ser X u O." };
  }

  return { valid: true, data: candidate as TicTacToeEngineRequest };
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validatePayload(payload);

    if (!validation.valid || !validation.data) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { board, currentPlayer } = validation.data;

    if (getWinner(board) || isBoardFull(board)) {
      return NextResponse.json(
        {
          error: "La partida ya terminó. Reinicia el tablero para seguir jugando.",
          data: {
            move: null,
            board,
            winner: getWinner(board),
            isDraw: !getWinner(board) && isBoardFull(board),
          },
        },
        { status: 400 },
      );
    }

    if (getAvailableMoves(board).length === 0) {
      return NextResponse.json(
        {
          data: {
            move: null,
            board: createEmptyBoard(),
            winner: null,
            isDraw: true,
          },
        },
        { status: 200 },
      );
    }

    const result = runTicTacToeEngine({
      ...validation.data,
      currentPlayer,
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo procesar la jugada.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
