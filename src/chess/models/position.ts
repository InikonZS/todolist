import { Figures } from './figures';
import { ICellCoord } from './icell-coord';
import { IFigure } from './ifigure';
import { IPosition } from './iPosition';

// TODO: переделать систему хранения. Сейчас одинаковые координаты могут дать разные объекты, т.е. разный ключ
export class Position implements IPosition {
  protected position: Map<string, IFigure>;
  constructor() {
    this.position = new Map<string, IFigure>();
  }
  addFigure(coord: ICellCoord, figure: IFigure) {
    this.position.set(coord.toString(), figure);
  }
  getFigure(coord: ICellCoord): IFigure | undefined {
    return this.position.get(coord.toString());
  }
  hasFigure(coord: ICellCoord): boolean {
    return this.position.has(coord.toString());
  }
  getAllFigures(): Figures {
    return new Figures(this.position.values());
  }
  deleteFigure(coord: ICellCoord) {
    this.position.delete(coord.toString());
  }
  addFigureStringCoord(sCoord: string, figure: IFigure) {
    this.position.set(sCoord, figure);
  }
  deleteFigureStringCoord(sCoord: string) {
    this.position.delete(sCoord);
  }
  getFigureStringCoord(sCoord: string): IFigure | undefined {
    return this.position.get(sCoord);
  }
  hasFigureStringCoord(sCoord: string): boolean {
    return this.position.has(sCoord);
  }
  copy() {
    const newPosition = new Map<string, IFigure>(this.position);
    const result = new Position();
    result.position = newPosition;
    return result;
  }
}
