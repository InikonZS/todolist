import { ICell } from './icell';

export interface IVector {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number): void;
  constructor(v: IVector): void;
  add(v: IVector): void;
  resultPosition(start: ICell): ICell;
}
