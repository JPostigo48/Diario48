import {
  applyMove,
  getAvailableMoves,
  getNextPlayer,
  getWinner,
  isTerminalBoard,
} from "./gameState";
import type {
  TicTacToeSearchInput,
  TicTacToeSearchResult,
} from "./types";

export function runMinimax({
  board,
  currentPlayer,
  aiPlayer,
  humanPlayer
}: TicTacToeSearchInput): TicTacToeSearchResult {
  return resolveMinimaxMove(board, currentPlayer, aiPlayer, humanPlayer, evaluateClassicBoard);
}

export function runMinimaxProfessor({
  board,
  currentPlayer,
  aiPlayer,
  humanPlayer,
}: TicTacToeSearchInput): TicTacToeSearchResult {
  return resolveMinimaxMove(
    board,
    currentPlayer,
    aiPlayer,
    humanPlayer,
    evaluateProfessorBoard,
  );
}

function resolveMinimaxMove(
  board: TicTacToeSearchInput["board"],
  currentPlayer: TicTacToeSearchInput["currentPlayer"],
  aiPlayer: TicTacToeSearchInput["aiPlayer"],
  humanPlayer: TicTacToeSearchInput["humanPlayer"],
  evaluateBoard: (
    board: TicTacToeSearchInput["board"],
    aiPlayer: TicTacToeSearchInput["aiPlayer"],
    humanPlayer: TicTacToeSearchInput["humanPlayer"],
  ) => number,
): TicTacToeSearchResult {
  const availableMoves = getAvailableMoves(board);

  if (!availableMoves.length) {
    return { move: null };
  }

  let bestMove = availableMoves[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const move of availableMoves) {
    const nextBoard = applyMove(board, move, currentPlayer);
    const score = computeMinimax(
      nextBoard,
      getNextPlayer(currentPlayer),
      aiPlayer,
      humanPlayer,
      evaluateBoard,
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return {
    move: bestMove,
  };
}

export function computeMinimax(
  board: TicTacToeSearchInput["board"],
  currentPlayer: TicTacToeSearchInput["currentPlayer"],
  aiPlayer: TicTacToeSearchInput["aiPlayer"],
  humanPlayer: TicTacToeSearchInput["humanPlayer"],
  evaluateBoard: (
    board: TicTacToeSearchInput["board"],
    aiPlayer: TicTacToeSearchInput["aiPlayer"],
    humanPlayer: TicTacToeSearchInput["humanPlayer"],
  ) => number,
): number {
  if (isTerminalBoard(board)) {
    return evaluateBoard(board, aiPlayer, humanPlayer);
  }

  const availableMoves = getAvailableMoves(board);
  const isMaximizing = currentPlayer === aiPlayer;
  let bestScore = isMaximizing
    ? Number.NEGATIVE_INFINITY
    : Number.POSITIVE_INFINITY;

  for (const move of availableMoves) {
    const nextBoard = applyMove(board, move, currentPlayer);
    const score = computeMinimax(
      nextBoard,
      getNextPlayer(currentPlayer),
      aiPlayer,
      humanPlayer,
      evaluateBoard,
    );
    bestScore = isMaximizing
      ? Math.max(bestScore, score)
      : Math.min(bestScore, score);
  }

  return bestScore;
}

function evaluateProfessorBoard(
  board: TicTacToeSearchInput["board"],
  aiPlayer: TicTacToeSearchInput["aiPlayer"],
  humanPlayer: TicTacToeSearchInput["humanPlayer"],
) {
  let score = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell === aiPlayer) score += 10;
      if (cell === humanPlayer) score -= 10;
    }
  }

  return score;
}

function evaluateClassicBoard(
  board: TicTacToeSearchInput["board"],
  aiPlayer: TicTacToeSearchInput["aiPlayer"],
  humanPlayer: TicTacToeSearchInput["humanPlayer"],
) {
  const winner = getWinner(board);

  if (winner === aiPlayer) {
    return 100;
  }

  if (winner === humanPlayer) {
    return -100;
  }

  return 0;
}
