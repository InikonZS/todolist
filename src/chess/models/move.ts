import { IFigure } from './ifigure';
import { IMove } from './imove';
import { IVector } from './ivector';

export class Move implements IMove {
  readonly figure: IFigure;
  readonly vector: IVector;
  constructor(figure: IFigure, vector: IVector) {
    this.figure = figure;
    this.vector = vector;
  }
}
