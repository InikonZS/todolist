import { ICellCoord } from './icell-coord';
import { IField } from './ifield';
import { IFigure } from './ifigure';
import { IVector } from './ivector';

export interface IMove {
  readonly startPosition: ICellCoord;
  readonly figure: IFigure;
  readonly vector: IVector;

  getResultPosition(): ICellCoord;
  toString(): string;
  isValid(field: IField): boolean;
  makeMove(field: IField): IField;
}
