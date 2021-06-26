import { CellCoord } from './cell-coord';
import { CellCoords } from './cell-coords';
import { ChessColor } from './chess-color';
import { COMMON } from './common';
import { Figures } from './figures';
import { ICellCoord } from './icell-coord';
import { IField } from './ifield';
import { IFigure } from './ifigure';
import { IPosition } from './iPosition';
import { Moves } from './moves';

export class Field implements IField {
  private position: IPosition;
  readonly playerColor: ChessColor;
  readonly isShortWhiteCastling: boolean;
  readonly isLongWhiteCastling: boolean;
  readonly isShortBlackCastling: boolean;
  readonly isLongBlackCastling: boolean;
  readonly pawnTresspassing: CellCoord | null;
  readonly fiftyRuleCount: number;
  readonly moveNumber: number;
  readonly cost: number;

  constructor(
    position: IPosition,
    playerColor: ChessColor,
    isShortWhiteCastling: boolean = true,
    isLongWhiteCastling: boolean = true,
    isShortBlackCastling: boolean = true,
    isLongBlackCastling: boolean = true,
    pawnTresspassing: CellCoord | null = null,
    fiftyRuleCount: number = 0,
    moveNumber: number = 1
  ) {
    this.position = position;
    this.playerColor = playerColor;
    this.isShortWhiteCastling = isShortWhiteCastling;
    this.isLongWhiteCastling = isLongWhiteCastling;
    this.isShortBlackCastling = isShortBlackCastling;
    this.isLongBlackCastling = isLongBlackCastling;
    this.pawnTresspassing = pawnTresspassing;
    this.fiftyRuleCount = fiftyRuleCount;
    this.moveNumber = moveNumber;

    this.cost = this.calculateCost();
  }

  copy(): IField {
    return new Field(this.position.copy(), this.playerColor);
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
    return this.position.getAllFigures();
  }
  getPosition(): IPosition {
    return this.position.copy();
  }
  getFigure(coord: ICellCoord): IFigure | undefined {
    return this.position.getFigure(coord);
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
    return !this.position.hasFigure(coord);
  }
  private calculateCost(): number {
    let result = 0;
    for (let figure of this.position.getAllFigures()) {
      const figureCost = COMMON.FIGURE_COST.get(figure.type);
      if (figureCost !== undefined) {
        result += figureCost * (figure.color == ChessColor.white ? 1 : -1);
      } else {
        throw new Error('Error in Field.calculateCost(): cannot find cost of figure');
      }
    }
    return result;
  }
  toFEN(): string {
    let result = new Array<string>();
    for (let y = 0; y < COMMON.BOARD_SIZE; y++) {
      let freeCount = 0;
      for (let x = 0; x < COMMON.BOARD_SIZE; x++) {
        let coord = new CellCoord(x, y);
        if (this.isFreeCell(coord)) {
          freeCount++;
        } else {
          if (freeCount > 0) {
            result.push(String(freeCount));
            freeCount = 0;
          }
          const figure = this.getFigure(coord);
          result.push(figure ? figure.toString() : '');
        }
      }
      if (freeCount > 0) {
        result.push(String(freeCount));
        freeCount = 0;
      }
      result.push(y == COMMON.BOARD_SIZE - 1 ? ' ' : '/');
    }
    result.push(this.playerColor == ChessColor.white ? 'w ' : 'b ');
    result.push(this.isShortWhiteCastling ? 'K' : '');
    result.push(this.isLongWhiteCastling ? 'Q' : '');
    result.push(this.isShortBlackCastling ? 'k' : '');
    result.push(this.isLongBlackCastling ? 'q' : '');
    result.push(' ');
    result.push(this.pawnTresspassing === null ? '-' : this.pawnTresspassing.toString());
    result.push(' ');
    result.push(String(this.fiftyRuleCount));
    result.push(' ');
    result.push(String(this.moveNumber));
    return result.join('');
  }

  // TODO: Implement next functions
  // getRecommendMoves(): Moves;
  // toString(): string;
  // isMate(): boolean
}
