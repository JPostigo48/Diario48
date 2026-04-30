import {
  applyMove,
  getWinner,
  isDraw,
} from "./gameState";
import { runAlphaBeta, runAlphaBetaProfessor } from "./alphaBeta";
import { runMinimax, runMinimaxProfessor } from "./minimax";
import type {
  TicTacToeEngineRequest,
  TicTacToeEngineResponse,
  TicTacToeSearchResult,
} from "./types";

function resolveSearchResult({
  algorithm,
  ...input
}: TicTacToeEngineRequest): TicTacToeSearchResult {
  switch (algorithm) {
    case "minimax":
      return runMinimax(input);
    case "minimax-professor":
      return runMinimaxProfessor(input);
    case "alpha-beta":
      return runAlphaBeta(input);
    case "alpha-beta-professor":
      return runAlphaBetaProfessor(input);
    default:
      return { move: null };
  }
}

export function runTicTacToeEngine(
  request: TicTacToeEngineRequest,
): TicTacToeEngineResponse {
  const { move } = resolveSearchResult(request);

  if (!move) {
    return {
      move: null,
      board: request.board,
      winner: getWinner(request.board),
      isDraw: isDraw(request.board),
    };
  }

  const nextBoard = applyMove(request.board, move, request.currentPlayer);
  const winner = getWinner(nextBoard);

  return {
    move,
    board: nextBoard,
    winner,
    isDraw: winner === null && isDraw(nextBoard),
  };
}
