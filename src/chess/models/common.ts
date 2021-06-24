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

  constructor() {}
}
