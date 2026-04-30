import {
  applyMove,
  getAvailableMoves,
  getNextPlayer,
  getWinner,
  isTerminalBoard,
} from "./gameState";
import type { TicTacToeSearchInput, TicTacToeSearchResult } from "./types";

export function runAlphaBeta({
  board,
  currentPlayer,
  aiPlayer,
  humanPlayer,
}: TicTacToeSearchInput): TicTacToeSearchResult {
  return resolveAlphaBetaMove(
    board,
    currentPlayer,
    aiPlayer,
    humanPlayer,
    evaluateClassicBoard,
  );
}

export function runAlphaBetaProfessor({
  board,
  currentPlayer,
  aiPlayer,
  humanPlayer,
}: TicTacToeSearchInput): TicTacToeSearchResult {
  return resolveAlphaBetaMove(
    board,
    currentPlayer,
    aiPlayer,
    humanPlayer,
    evaluateProfessorBoard,
  );
}

function resolveAlphaBetaMove(
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
  let alpha = Number.NEGATIVE_INFINITY;
  const beta = Number.POSITIVE_INFINITY;

  for (const move of availableMoves) {
    const nextBoard = applyMove(board, move, currentPlayer);
    const score = computeAlphaBeta(
      nextBoard,
      getNextPlayer(currentPlayer),
      aiPlayer,
      humanPlayer,
      alpha,
      beta,
      evaluateBoard,
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }

    alpha = Math.max(alpha, bestScore);
  }

  return { move: bestMove };
}

function computeAlphaBeta(
  board: TicTacToeSearchInput["board"],
  currentPlayer: TicTacToeSearchInput["currentPlayer"],
  aiPlayer: TicTacToeSearchInput["aiPlayer"],
  humanPlayer: TicTacToeSearchInput["humanPlayer"],
  alpha: number,
  beta: number,
  evaluateBoard: (
    board: TicTacToeSearchInput["board"],
    aiPlayer: TicTacToeSearchInput["aiPlayer"],
    humanPlayer: TicTacToeSearchInput["humanPlayer"],
  ) => number,
) {
  if (isTerminalBoard(board)) {
    return evaluateBoard(board, aiPlayer, humanPlayer);
  }

  const availableMoves = getAvailableMoves(board);
  const isMaximizing = currentPlayer === aiPlayer;

  if (isMaximizing) {
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const move of availableMoves) {
      const score = computeAlphaBeta(
        applyMove(board, move, currentPlayer),
        getNextPlayer(currentPlayer),
        aiPlayer,
        humanPlayer,
        alpha,
        beta,
        evaluateBoard,
      );

      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);

      if (beta <= alpha) {
        break;
      }
    }

    return bestScore;
  }

  let bestScore = Number.POSITIVE_INFINITY;

  for (const move of availableMoves) {
    const score = computeAlphaBeta(
      applyMove(board, move, currentPlayer),
      getNextPlayer(currentPlayer),
      aiPlayer,
      humanPlayer,
      alpha,
      beta,
      evaluateBoard,
    );

    bestScore = Math.min(bestScore, score);
    beta = Math.min(beta, bestScore);

    if (beta <= alpha) {
      break;
    }
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
