import { CellCoord } from './cell-coord';
import { CellCoords } from './cell-coords';
import { ChessColor } from './chess-color';
import { COMMON } from './common';
import { Figures } from './figures';
import { ICellCoord } from './icell-coord';
import { IField } from './ifield';
import { IFigure } from './ifigure';
import { Move } from './move';
import { Moves } from './moves';
import { Position } from './position';

export class Field implements IField {
  private position: Position;
  readonly playerColor: ChessColor;
  readonly cost: number;

  constructor(position: Position, playerColor: ChessColor) {
    this.position = position;
    this.playerColor = playerColor;
    this.cost = this.calculateCost();
  }

  copy(): IField {
    return new Field(new Position(this.position), this.playerColor);
  }
  getAllCellCoords(): CellCoords {
    const result = new CellCoords();
    for (let i = 0; i < COMMON.BOARD_SIZE; i++) {
      for (let j = 0; j < COMMON.BOARD_SIZE; j++) {
        result.add(new CellCoord(i, j));
      }
    }
    return result;
  }
  getFigures(): Figures {
    return new Figures(this.position.values());
  }
  getPosition(): Position {
    return new Position(this.position);
  }
  getFigure(coord: ICellCoord): IFigure | undefined {
    return this.position.get(coord);
  }

  getAllowedMoves(coord: ICellCoord): Moves {
    let figure = this.getFigure(coord);
    if (figure === undefined) {
      return new Moves();
    } else {
      return figure.getMoves(coord, this);
      // TODO: отфильтровать по корректности здесь, либо в Figure.gerMoves() UPD: Проверять не надо, в генерации для фигуры будем генерировать только корректные
    }
  }
  isFreeCell(coord: ICellCoord): boolean {
    return !this.position.has(coord);
  }
  private calculateCost(): number {
    let result = 0;
    for (let figure of this.position.values()) {
      const figureCost = COMMON.FIGURE_COST.get(figure.type);
      if (figureCost !== undefined) {
        result += figureCost * (figure.color == ChessColor.white ? 1 : -1);
      } else {
        throw new Error('Error in Field.calculateCost(): cannot find cost of figure');
      }
    }
    return result;
  }
  makeMove(move: Move): IField {
    const resultPosition = new Position(this.position);
    const targetCell = move.getResultPosition();
    if (!this.isFreeCell(targetCell)) {
      resultPosition.delete(targetCell);
    }
    resultPosition.set(targetCell, move.figure);
    resultPosition.delete(move.startPosition);
    return new Field(resultPosition, this.playerColor == ChessColor.white ? ChessColor.black : ChessColor.white);
  }

  // TODO: Implement next functions
  // getRecommendMoves(): Moves;
  // toString(): string;
  // makeMove(move: Move): IField;
  // isMate(): boolean
}
