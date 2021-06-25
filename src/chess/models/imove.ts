import { ICellCoord } from './icell-coord';
import { IField } from './ifield';
import { IVector } from './ivector';

export interface IMove {
  readonly startPosition: ICellCoord;
  readonly vector: IVector;

  getResultPosition(): ICellCoord;
  toString(): string;
  isValid(field: IField): boolean;
  makeMove(field: IField): IField;
}
