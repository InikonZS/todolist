import { CellCoords } from './cell-coords';
import { ICellCoord } from './icell-coord';
import { IFigure } from './ifigure';
import { IMove } from './imove';
import { IVector } from './ivector';

export class Move implements IMove {
  readonly startPosition: ICellCoord;
  readonly figure: IFigure;
  readonly vector: IVector;
  constructor(startPosition: ICellCoord, figure: IFigure, vector: IVector) {
    this.startPosition = startPosition;
    this.figure = figure;
    this.vector = vector;
  }
  getResultPosition(): ICellCoord {
    return this.vector.resultPosition(this.startPosition);
  }
  toString(): string {
    // TODO: добавить проверку на взятие фигуры
    // TODO: добавить рокировку
    return `${this.figure.toString()}${this.startPosition.toString}—${this.vector.resultPosition(this.startPosition)}`;
  }
}
