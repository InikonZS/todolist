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
  sign: string;
};

export interface IChessData {
  message: string;
  coords: Array<ICellCoords>;
  player: string;
  field: Array<string>;
  winner: string;
  sign: string;
};


export interface IChannelDTO {
  name: string;
}

export interface IuserChatMessage {
  avatar: string;
  userName: string;
  time: string;
  message: string;
}
