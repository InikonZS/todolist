import { ICellCoord } from './icell-coord';
import { IFigure } from './ifigure';
import { IVector } from './ivector';

export interface IMove {
  readonly startPosition: ICellCoord;
  readonly figure: IFigure;
  readonly vector: IVector;

  toString(): string;
}
