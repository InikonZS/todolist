export class CellCoord {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  copy(): CellCoord {
    return new CellCoord(this.x, this.y);
  }
}
