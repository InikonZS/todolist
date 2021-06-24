import { CellCoord } from './cell-coord';
import { ChessColor } from './chess-color';

export interface ICell {
  // constructor(x: number, y: number): ICell;

  readonly coords: CellCoord;
  readonly color: ChessColor;

  toString(): string;
  copy(): ICell;
}
