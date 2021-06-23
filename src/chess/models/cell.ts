import { CellCoord } from './cell-coord';
import { ChessColor } from './chess-color';
import { ICell } from './icell';

export class Cell implements ICell {
  readonly coords: CellCoord;
  constructor(x: number, y: number) {
    this.coords = new CellCoord(x, y);
  }
  get color(): ChessColor {
    return (this.coords.x + this.coords.y) % 2 == 0 ? ChessColor.white : ChessColor.black;
  }
  toString(): string {
    // TODO: implement method
    return '';
  }
}
