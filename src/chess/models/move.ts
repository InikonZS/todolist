import { ChessColor } from './chess-color';
import { Field } from './field';
import { ICellCoord } from './icell-coord';
import { IField } from './ifield';
import { IMove } from './imove';
import { IPosition } from './iPosition';
import { IVector } from './ivector';

export class Move implements IMove {
  readonly startPosition: ICellCoord;
  readonly vector: IVector;
  constructor(startPosition: ICellCoord, vector: IVector) {
    this.startPosition = startPosition;
    this.vector = vector;
  }
  getResultPosition(): ICellCoord {
    return this.vector.resultPosition(this.startPosition);
  }
  getNotation(field: IField): string {
    // TODO: добавить проверку на взятие фигуры
    // TODO: добавить рокировку
    if (this.isValid(field)) {
      return `${field.getFigure(this.startPosition)?.toString()}${this.startPosition.toString}—${this.vector.resultPosition(this.startPosition)}`;
    } else return 'Illegal Move';
  }
  isValid(field: IField): boolean {
    let result = false;
    if (!field.isFreeCell(this.startPosition)) {
      const fieldFigure = field.getFigure(this.startPosition);
      if (field.playerColor === fieldFigure?.color) {
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
    const resultPosition: IPosition = field.getPosition();
    const targetCell = this.getResultPosition();
    const figure = field.getFigure(this.startPosition);
    if (!field.isFreeCell(targetCell)) {
      resultPosition.deleteFigure(targetCell);
    }
    if (figure) {
      resultPosition.addFigure(targetCell, figure);
      resultPosition.deleteFigure(this.startPosition);
      return new Field(resultPosition, field.playerColor == ChessColor.white ? ChessColor.black : ChessColor.white);
    } else {
      throw new Error('Error in Move.makeMove: empty start position');
    }
  }
}
