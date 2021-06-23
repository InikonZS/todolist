import { Cells } from './cells';
import { ChessColor } from './chess-color';
import { Figures } from './figures';
import { ICell } from './icell';
import { IFigure } from './ifigure';
import { Moves } from './moves';

export interface IField {
  readonly figures: Figures;
  readonly playerColor: ChessColor;

  constructor(figures: Figures, playerColor: ChessColor): void;
  copy(): IField;
  getCost(): number;
  getRecommendMoves(): Moves;
  getAllCells(): Cells;
  getFigure(cell: ICell): IFigure;
  getAllowedMoves(figure: IFigure): Moves;
  isFreeCell(cell: ICell): boolean;
  isCorrectCell(cell: ICell): boolean;
  toString(): string;
}
