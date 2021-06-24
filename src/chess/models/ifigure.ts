import { CellCoord } from './cell-coord';
import { ChessColor } from './chess-color';
import { FigureType } from './figure-type';
import { Moves } from './moves';
import { IField } from './ifield';

export interface IFigure {
  readonly color: ChessColor;
  readonly type: FigureType;

  // getCoords(): CellCoord;
  // move(vector: IVector): boolean;
  toString(): string;
  getMoves(position: CellCoord, field: IField): Moves;
  // TODO: обработка рокировки (isMoved или isRocked какой...)
}
