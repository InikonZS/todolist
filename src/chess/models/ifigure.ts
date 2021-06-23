import { CellCoord } from './cell-coord';
import { ChessColor } from './chess-color';
import { FigureType } from './figure-type';
import { Moves } from './moves';
import { IVector } from './ivector';

export interface IFigure {
  readonly coords: CellCoord;
  readonly color: ChessColor;
  readonly type: FigureType;
  move(vector: IVector): boolean;
  toString(): string;
  getMoves(): Moves;
}
