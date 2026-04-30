export type Player = "X" | "O";

export type CellValue = Player | null;

export type Board = CellValue[][];

export type AlgorithmType =
  | "minimax"
  | "minimax-professor"
  | "alpha-beta"
  | "alpha-beta-professor";

export type Winner = Player | "draw" | null;

export interface TicTacToeMove {
  row: number;
  col: number;
}

export interface TicTacToeSearchInput {
  board: Board;
  currentPlayer: Player;
  aiPlayer: Player;
  humanPlayer: Player;
}

export interface TicTacToeSearchResult {
  move: TicTacToeMove | null;
}

export interface TicTacToeEngineRequest extends TicTacToeSearchInput {
  algorithm: AlgorithmType;
}

export interface TicTacToeEngineResponse {
  move: TicTacToeMove | null;
  board: Board;
  winner: Winner;
  isDraw: boolean;
}
