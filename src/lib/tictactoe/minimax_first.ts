import { cloneBoard, getAvailableMoves, getNextPlayer, getWinner, isDraw, isTerminalBoard } from "./gameState";
import type { Player, TicTacToeSearchInput, TicTacToeSearchResult, TicTacToeMove, Board } from "./types";

export function runMinimax({
  board,
}: TicTacToeSearchInput): TicTacToeSearchResult {
  // TODO: reemplaza esta estrategia base por tu implementación real de Minimax.
  // const firstAvailableMove = getAvailableMoves(board)[0] ?? null;
  const firstAvailableMove = { row:0, col:0 };
  let move = { row:0, col:0 };
  const availableMoves = getAvailableMoves(board);

  let best = -2
  for (const {row, col} of availableMoves) {
    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = 'O';
    const result = computeMiniMax(nextBoard, 'X');
    if (result > best) {
      best = result
      move = { row, col }
    }
  }

  return {
    move
  };
}



export function computeMiniMax(
  board: Board,
  currentPlayer: Player
): number {
  if (isTerminalBoard(board)) {
    if (isDraw(board)) return 0
    return (getWinner(board)=='O') ? 1 : -1
  }
  let best = 2
  const next = getNextPlayer(currentPlayer)
  const availableMoves = getAvailableMoves(board)
  for (const {row, col} of availableMoves) {
    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = currentPlayer;
    if(currentPlayer=='O') {
      if (best==2) best = -1
      best = Math.max(best, computeMiniMax(nextBoard, next))
    } else {
      if (best==2) best = 1
      best = Math.min(best, computeMiniMax(nextBoard, next))
    }
  }
  return best
}