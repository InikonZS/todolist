import { ICellCoord } from './icell-coord';
import { IFigure } from './ifigure';

// TODO: переделать систему хранения. Сейчас одинаковые координаты могут дать разные объекты, т.е. разный ключ
export class Position extends Map<ICellCoord, IFigure> {}
