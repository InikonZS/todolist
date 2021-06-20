export interface ICellCoords {
  x: number;
  y: number;
}

export default interface ICrossData {
  message: string;
  coords: ICellCoords;
  player: string;
  field: Array<string>;
  winner: string;
  sign: string
}