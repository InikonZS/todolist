import { ChessColor } from './chess-color';
import { Field } from './field';
import { ICellCoord } from './icell-coord';
import { IField } from './ifield';
import { IFigure } from './ifigure';
import { IMove } from './imove';
import { IVector } from './ivector';

export class Move implements IMove {
  readonly startPosition: ICellCoord;
  readonly figure: IFigure;
  readonly vector: IVector;
  constructor(startPosition: ICellCoord, figure: IFigure, vector: IVector) {
    this.startPosition = startPosition;
    this.figure = figure;
    this.vector = vector;
  }
  getResultPosition(): ICellCoord {
    return this.vector.resultPosition(this.startPosition);
  }
  toString(): string {
    // TODO: добавить проверку на взятие фигуры
    // TODO: добавить рокировку
    return `${this.figure.toString()}${this.startPosition.toString}—${this.vector.resultPosition(this.startPosition)}`;
  }
  isValid(field: IField): boolean {
    let result = false;
    if (!field.isFreeCell(this.startPosition)) {
      const fieldFigure = field.getFigure(this.startPosition);
      if (this.figure.color === fieldFigure?.color && this.figure.type === fieldFigure.type) {
        const fieldMoves = field.getAllowedMoves(this.startPosition);
        const legalDestinations = new Set<String>();
        for (let fieldMove of fieldMoves) {
          legalDestinations.add(fieldMove.getResultPosition.toString());
        }
        result = legalDestinations.has(this.getResultPosition().toString());
      }
    }
    return result;
  }
  makeMove(field: IField): IField {
    const resultPosition = field.getPosition();
    const targetCell = this.getResultPosition();
    if (!field.isFreeCell(targetCell)) {
      resultPosition.delete(targetCell.toString());
    }
    resultPosition.set(targetCell.toString(), this.figure);
    resultPosition.delete(this.startPosition.toString());
    return new Field(resultPosition, field.playerColor == ChessColor.white ? ChessColor.black : ChessColor.white);
  }
}
