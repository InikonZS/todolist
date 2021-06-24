import { FigureType } from './figure-type';

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
        [FigureType.knighnt, 'N'],
        [FigureType.pawn, ''],
      ]),
    ],
    [
      LOCALES.RU,
      new Map([
        [FigureType.king, 'Кр'],
        [FigureType.queen, 'Ф'],
        [FigureType.rook, 'Л'],
        [FigureType.bishop, 'С'],
        [FigureType.knighnt, 'К'],
        [FigureType.pawn, ''],
      ]),
    ],
  ]);
  static FIGURE_COST = new Map([
    [FigureType.king, 900],
    [FigureType.queen, 90],
    [FigureType.rook, 50],
    [FigureType.bishop, 30],
    [FigureType.knighnt, 30],
    [FigureType.pawn, 10],
  ]);

  constructor() {}
}
