import { CellCoord } from './cell-coord';
import { ChessColor } from './chess-color';

export interface ICell {
  getCoords(): CellCoord;
  getColor(): ChessColor;
  toString(): string;
}
