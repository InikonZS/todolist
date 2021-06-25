import { CellCoord } from './cell-coord';
import { ChessColor } from './chess-color';
import { COMMON } from './common';
import { FigureType } from './figure-type';
import { IField } from './ifield';
import { IFigure } from './ifigure';
import { Moves } from './moves';

export abstract class Figure implements IFigure {
  readonly type: FigureType;
  readonly color: ChessColor;
  constructor(type: FigureType, color: ChessColor) {
    this.type = type;
    this.color = color;
  }
  abstract getMoves(position: CellCoord, field: IField): Moves;
  toString(): string {
    let shortName = COMMON.FIGURE_SHORT_NAMES.get(COMMON.DEFAULT_LOCALE)?.get(this.type);
    if (shortName !== undefined) {
      return this.color === ChessColor.white ? shortName.toUpperCase() : shortName.toLowerCase();
    } else {
      throw new Error('Error in Figure.toString(): cannot find figure name');
    }
  }
}
