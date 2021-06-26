import { CellCoord } from './cell-coord';
import { CellCoords } from './cell-coords';
import { ChessColor } from './chess-color';
import { Figures } from './figures';
import { ICellCoord } from './icell-coord';
import { IFigure } from './ifigure';
import { IPosition } from './iPosition';
import { Moves } from './moves';

export interface IField {
  readonly playerColor: ChessColor;
  readonly isShortWhiteCastling: boolean;
  readonly isLongWhiteCastling: boolean;
  readonly isShortBlackCastling: boolean;
  readonly isLongBlackCastling: boolean;
  readonly pawnTresspassing: CellCoord | null;
  readonly fiftyRuleCount: number;
  readonly isFirstMove: boolean;

  copy(): IField;
  getAllCellCoords(): CellCoords;
  getFigure(coord: ICellCoord): IFigure | undefined;
  getFigures(): Figures;
  getPosition(): IPosition;
  getAllowedMoves(coord: ICellCoord): Moves;
  isFreeCell(coord: ICellCoord): boolean;

  // TODO: Implement next functions
  // getRecommendMoves(): Moves;
  // toString(): string;
  // isMate(): boolean
}
