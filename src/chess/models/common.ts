import { FigureType } from './figure-type';
import { Vector } from './vector';

export enum LOCALES {
  RU,
  EN,
}

export class COMMON {
  static NOVEMDECIMAL_BASE = 19;
  static BOARD_SIZE = 8;
  static DEFAULT_LOCALE = LOCALES.EN;
  static FIGURE_SHORT_NAMES = new Map([
    // TODO: переписать красиво, чтобы удобно было обращаться к элементам
    [
      LOCALES.EN,
      new Map([
        [FigureType.king, 'K'],
        [FigureType.queen, 'Q'],
        [FigureType.rook, 'R'],
        [FigureType.bishop, 'B'],
        [FigureType.knight, 'N'],
        [FigureType.pawn, 'P'],
      ]),
    ],
    [
      LOCALES.RU,
      new Map([
        [FigureType.king, 'Кр'],
        [FigureType.queen, 'Ф'],
        [FigureType.rook, 'Л'],
        [FigureType.bishop, 'С'],
        [FigureType.knight, 'К'],
        [FigureType.pawn, 'П'],
      ]),
    ],
  ]);
  static FIGURE_COST = new Map([
    [FigureType.king, 900],
    [FigureType.queen, 90],
    [FigureType.rook, 50],
    [FigureType.bishop, 30],
    [FigureType.knight, 30],
    [FigureType.pawn, 10],
  ]);
  static DIAGONAL_MOVES = [new Vector(-1, -1), new Vector(-1, 1), new Vector(1, -1), new Vector(1, 1)];
  static HV_MOVES = [new Vector(-1, 0), new Vector(1, 0), new Vector(0, -1), new Vector(0, 1)];
  static UP_MOVES = [new Vector(0, -1)];
  static DOWN_MOVES = [new Vector(0, 1)];
  static KNIGHT_MOVES = [new Vector(-2, -1), new Vector(-1, -2), new Vector(1, -2), new Vector(2, -1), new Vector(2, 1), new Vector(1, 2), new Vector(-1, 2), new Vector(-2, 1)];

  constructor() {}
}
