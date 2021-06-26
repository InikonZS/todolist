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
  static fromString(sCoord: string): CellCoord {
    if (sCoord.length !== 2) {
      throw new Error('Error in CellCoord.fromString(sCoord): incorrect cell coordinate');
    } else {
      let xCoord = sCoord.charCodeAt(0) - 'a'.charCodeAt(0);
      let yCoord = COMMON.BOARD_SIZE - 1 - (sCoord.charCodeAt(1) - '1'.charCodeAt(0));
      return new CellCoord(xCoord, yCoord);
    }
  }
}
