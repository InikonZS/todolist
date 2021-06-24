import { Cell } from './cell';
import { CellCoord } from './cell-coord';
import { ChessColor } from './chess-color';
import { COMMON, LOCALES } from './common';
import { FigureType } from './figure-type';
import { IFigure } from './ifigure';
import { IVector } from './ivector';
import { Moves } from './moves';

export abstract class Figure implements IFigure {
  readonly type: FigureType;
  readonly color: ChessColor;
  private coords: CellCoord;
  constructor(type: FigureType, color: ChessColor, coords: CellCoord) {
    this.type = type;
    this.color = color;
    this.coords = coords;
  }
  getCoords(): CellCoord {
    return this.coords;
  }
  move(vector: IVector): boolean {
    // TODO: добавить проверку на корректность хода, или переложить эту проверку на доску.
    this.coords = vector.resultPosition(this.coords);
    return true;
  }
  abstract getMoves(): Moves;
  toString(): string {
    let shortName = COMMON.FIGURE_SHORT_NAMES.get(COMMON.DEFAULT_LOCALE)?.get(this.type);
    if (shortName !== undefined) {
      return shortName + new Cell(this.coords).toString();
    } else {
      throw new Error('Error in Figure.toString(): cannot find figure name');
    }
  }
}
