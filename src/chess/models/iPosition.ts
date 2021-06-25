import { Figures } from './figures';
import { ICellCoord } from './icell-coord';
import { IFigure } from './ifigure';

export interface IPosition {
  addFigure(coord: ICellCoord, figure: IFigure): void;
  getFigure(coord: ICellCoord): IFigure | undefined;
  hasFigure(coord: ICellCoord): boolean;
  getAllFigures(): Figures;
  deleteFigure(coord: ICellCoord): void;
  addFigureStringCoord(sCoord: string, figure: IFigure): void;
  deleteFigureStringCoord(sCoord: string): void;
  getFigureStringCoord(sCoord: string): IFigure | undefined;
  hasFigureStringCoord(sCoord: string): boolean;
  copy(): IPosition;
}
