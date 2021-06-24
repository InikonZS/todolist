import { ICellCoord } from './icell-coord';
import { IFigure } from './ifigure';

export class Position extends Map<ICellCoord, IFigure> {}
