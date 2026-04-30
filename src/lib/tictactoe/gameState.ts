import type { Board, Player, TicTacToeMove, Winner } from "./types";

export function createEmptyBoard(): Board {
  return Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function isInsideBoard(row: number, col: number) {
  return row >= 0 && row < 3 && col >= 0 && col < 3;
}

export function getAvailableMoves(board: Board): TicTacToeMove[] {
  const moves: TicTacToeMove[] = [];

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      if (board[row]?.[col] === null) {
        moves.push({ row, col });
      }
    }
  }

  return moves;
}

export function applyMove(board: Board, move: TicTacToeMove, player: Player): Board {
  if (!isInsideBoard(move.row, move.col)) {
    throw new Error("La jugada está fuera del tablero.");
  }

  if (board[move.row][move.col] !== null) {
    throw new Error("La celda seleccionada ya está ocupada.");
  }

  const nextBoard = cloneBoard(board);
  nextBoard[move.row][move.col] = player;
  return nextBoard;
}

export function getWinner(board: Board): Winner {
  const lines = [
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]],
  ];

  for (const [a, b, c] of lines) {
    if (a && a === b && b === c) {
      return a;
    }
  }

  return null;
}

export function isBoardFull(board: Board) {
  return board.every((row) => row.every((cell) => cell !== null));
}

export function isDraw(board: Board) {
  return getWinner(board) === null && isBoardFull(board);
}

export function getNextPlayer(player: Player): Player {
  return player === "X" ? "O" : "X";
}

export function isTerminalBoard(board: Board) {
  return getWinner(board) !== null || isBoardFull(board);
}

