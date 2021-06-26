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
  readonly isFirstMove: boolean;
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
    isFirstMove: boolean = false
  ) {
    this.position = position;
    this.playerColor = playerColor;
    this.isShortWhiteCastling = isShortWhiteCastling;
    this.isLongWhiteCastling = isLongWhiteCastling;
    this.isShortBlackCastling = isShortBlackCastling;
    this.isLongBlackCastling = isLongBlackCastling;
    this.pawnTresspassing = pawnTresspassing;
    this.fiftyRuleCount = fiftyRuleCount;
    this.isFirstMove = isFirstMove;

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

  // TODO: Implement next functions
  // getRecommendMoves(): Moves;
  // toString(): string;
  // isMate(): boolean
}
