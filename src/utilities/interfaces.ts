import Vector from "src/chess/modules/components/vector";

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
  // field: Array<string>;
  field: string;
  winner: string;
  rotate: boolean;
  figure: Array<string>;
  moves: Array<Array<Vector>>
  king: Vector
}

export interface IChannelDTO {
  name: string;
}

export interface IuserChatMessage {
  avatar: string;
  userName: string;
  time: string;
  message: string;
}

export interface IHistoryView {
  node: string;
  title: string;
  wrapper: string;
  item: string;
  figure: string;
  text: string;
}

export interface ICellConfig {
  cell: string;
  validMove: string;
  kingCell: string;
  light: string;
  dark: string;
}
export interface IBoardCellView {
  boardView: string;
  cell: ICellConfig;
}

export interface IGameField {
  board: string;
  field: string;
  cell: string;
  hover: string;
}

export interface IChessView {
  wrapper: string;
  controls: string;
  head: string;
  player: string;
  body: string;
}

export interface IChessBtn {
  btnEnabled: string;
  btnDisabled: string;
}

export interface IChessConfigView {
  history: IHistoryView;
  figure: string;
  boardView: IBoardCellView;
  gameField: IGameField;
  chessView: IChessView;
  btn: IChessBtn;
}

export interface ILangViewControl {
  start: string;
  draw: string;
  loss: string;
}

export interface IModalPopup {
  wrapper: string;
  message: string;
  text: string;
  btn: IChessBtn;
}

export interface ILangViewPlayer {
  player1: string;
  player2: string;
}

export interface ILangViewModal {
  gameOver: string;
  draw: string;
  loss: string;
  btnContent: string;
}
export interface IChannelWrapper {
  wrapper: string;
  constrols: string;
  channels: string;
  channel: string;
  btn: string;
}

export interface IChessLang {
  history: string;
  controls: ILangViewControl;
  players: ILangViewPlayer;
  modals: ILangViewModal;
}
export interface ILangView {
  chess: IChessLang;
}
export interface IChannelBtn {
  btn: string;
}

export interface IMessageBtn {
  btn: string;
}

export interface IUsersLang {
  players: string;
  spectators: string;
}

export interface IChatMessage {
  block: string;
  wrapper: string;
  avatar: string;
  main: string;
  header: string;
  user: string;
  date: string;
  body: string;
}

export interface IInputWrapper {
  wrapper: string;
  field: string;
  button: string;
}

export interface IChatMessageWrapper {
  wrapper: string;
  message: IChatMessage;
}

export interface IChatUser {
  wrapper: string;
  avatar: string;
  name: string;
}

export interface IChatUserWrapper {
  wrapper: string;
  category: string;
  categoryName: string;
  user: IChatUser;
}

export interface IChessStart {
  field: string;
  time: number;
}

export interface IChessStop {
  stop: string;
  player: string;
}
export interface IPageComponent {
  show: () => void;
  hide: () => void;
}

export interface IUserData {
  login: string,
  password: string,
  avatar: string
};

export interface IPublicUserInfo{
  login:string,
  avatar:string
}
