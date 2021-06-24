import { Cell } from './cell';
import { ICell } from './icell';
import { IVector } from './ivector';

export class Vector implements IVector {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  copy(): IVector {
    return new Vector(this.x, this.y);
  }
  sum(vector: IVector): IVector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
  resultPosition(startCell: ICell): ICell {
    return new Cell(startCell.coords.x + this.x, startCell.coords.y + this.y);
  }
}
