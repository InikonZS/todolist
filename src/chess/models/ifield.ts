import { CellCoords } from './cell-coords';
import { ChessColor } from './chess-color';
import { Figures } from './figures';
import { ICellCoord } from './icell-coord';
import { IFigure } from './ifigure';
import { Moves } from './moves';
import { Position } from './position';

export interface IField {
  readonly playerColor: ChessColor;

  copy(): IField;
  getAllCellCoords(): CellCoords;
  getFigure(coord: ICellCoord): IFigure | undefined;
  getFigures(): Figures;
  getPosition(): Position;
  getAllowedMoves(coord: ICellCoord): Moves;
  isFreeCell(coord: ICellCoord): boolean;

  // TODO: Implement next functions
  // getRecommendMoves(): Moves;
  // toString(): string;
  // isMate(): boolean
}
