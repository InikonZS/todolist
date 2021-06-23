import { IFigure } from './ifigure';
import { IVector } from './ivector';

export interface IMove {
  readonly figure: IFigure;
  readonly vector: IVector;
  constructor(figure: IFigure, v: IVector): void;
  toString(): string;
}
