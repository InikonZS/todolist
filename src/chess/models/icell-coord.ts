import { ChessColor } from './chess-color';

export interface ICellCoord {
  readonly x: number;
  readonly y: number;

  copy(): ICellCoord;
  isCorrect(): boolean;
  toString(): string;
  getColor(): ChessColor;
}
