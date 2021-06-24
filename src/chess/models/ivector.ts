import { ICell } from './icell';

export interface IVector {
  readonly x: number;
  readonly y: number;
  sum(v: IVector): IVector;
  copy(): IVector;
  resultPosition(start: ICell): ICell;
}
