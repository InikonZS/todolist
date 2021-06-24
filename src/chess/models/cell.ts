import { CellCoord } from './cell-coord';
import { ChessColor } from './chess-color';
import { COMMON } from './common';
import { ICell } from './icell';

export class Cell implements ICell {
  readonly coords: CellCoord;
  constructor(coords: CellCoord) {
    this.coords = coords;
  }
  get color(): ChessColor {
    return (this.coords.x + this.coords.y) % 2 == 0 ? ChessColor.white : ChessColor.black;
  }
  toString(): string {
    return Number(this.coords.x + 10).toString(COMMON.NOVEMDECIMAL_BASE) + (COMMON.BOARD_SIZE - this.coords.y);
  }
}
