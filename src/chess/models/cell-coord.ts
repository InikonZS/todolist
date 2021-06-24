import { ChessColor } from './chess-color';
import { COMMON } from './common';
import { ICellCoord } from './icell-coord';

export class CellCoord implements ICellCoord {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  copy(): CellCoord {
    return new CellCoord(this.x, this.y);
  }
  isCorrect(): boolean {
    return this.x >= 0 && this.x < COMMON.BOARD_SIZE && this.y >= 0 && this.y < COMMON.BOARD_SIZE;
  }
  toString(): string {
    return Number(this.x + 10).toString(COMMON.NOVEMDECIMAL_BASE) + (COMMON.BOARD_SIZE - this.y);
  }
  getColor(): ChessColor {
    return (this.x + this.y) % 2 == 0 ? ChessColor.white : ChessColor.black;
  }
}
