import { IChessStart } from './../../utilities/interfaces';
import { IChessData } from 'utilities/interfaces';
import { Component } from 'utilities/Component';
import {
  ICellCoords,
  IChessLang,
  IChessView,
  ILangView,
  ILangViewModal,
  ILangViewPlayer
} from 'utilities/interfaces';
import ChessCell from './chess-cell';
import ChessButton from './chess-button';
import './chess-game.css';
import ChessHistoryBlock from './chess-history';
import ChessField from './chess-field';
import Vector from 'utilities/vector';
import configFigures, { chessConfigView, fen } from 'utilities/config-chess';
import ModalDraw from './modal-draw';
import ModalLoss from './modal-loss';
import ChessModel from './chess-model';
import Timer from 'utilities/timer';

let size = 8;
// class Timer extends Component {
//   private counter: number = 0;
//   private count: number = 10;
//   private time: number;
//   private startTime: number = 0;
//   private isPlaying: boolean = false;

//   constructor(parentNode: HTMLElement) {
//     super(parentNode, 'div', [ 'cross_timer' ]);
//     this.element.textContent = '00:10';
//   }
//   start() {
//     this.counter = window.setInterval(() => {
//       this.time = Math.floor((Date.now() - this.startTime) / 1000);
//       this.element.textContent = this.getTimeString();
//     }, 1000);
//   }

//   clear() {
//     if (this.counter) {
//       window.clearInterval(this.counter);
//       this.counter = 0;
//       this.element.textContent = '00:00';
//       this.startTime += 11000;
//     }
//   }

//   countDown() {
//     this.counter = window.setInterval(() => {
//       if (this.count - this.time === 0) {
//         this.clear();
//         this.start();
//         this.isPlaying = true;
//       } else {
//         this.time = Math.floor((Date.now() - this.startTime) / 1000);
//         this.element.textContent = this.getCountDownString();
//       }
//     }, 1000);
//   }

//   setTimer(startTime: number) {
//     this.startTime = startTime;
//     this.time = startTime;
//     this.countDown();
//   }

//   getCountDownString(): string {
//     const seconds = Math.floor((this.count - this.time) % 60);

//     const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
//     return `00:${secOutput}`;
//   }

//   getTimeString(): string {
//     const minutes = Math.floor(this.time / 60);
//     const seconds = Math.floor(this.time % 60);

//     const minOutput = minutes < 10 ? `0${minutes}` : `${minutes}`;
//     const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
//     return `${minOutput}:${secOutput}`;
//   }

//   getIsPlaying(): boolean {
//     return this.isPlaying;
//   }
// }

class ChessGame extends Component {
  private cells: Array<ChessCell> = [];
  public onCellClick: (coords: ICellCoords) => void = () => {};
  timer: Timer;
  private history: ChessHistoryBlock;
  private playerOne: Component;
  private playerTwo: Component;
  private players: number = 0;
  private isRotated: boolean = false;
  private chessBoard: ChessField;
  private btnStart: ChessButton;
  public onStartClick: () => void = () => {};
  private btnDraw: ChessButton;
  public onDrawClick: () => void = () => {};
  private btnLoss: ChessButton;
  public onLossClick: () => void = () => {};
  public onFigureDrop: (posStart: Vector, posDrop: Vector) => void = () => {};
  public onFigureGrab: (pos: Vector) => void = () => {};
  private chessView: IChessView;
  private langConfig: ILangViewPlayer;
  private modalDraw: ModalDraw;
  private langConfigModals: ILangViewModal;
  public onModalDrawClick: () => void = () => {};
  private modalLoss: ModalLoss;
  public onModalLossClick: () => void = () => {};
  private model: ChessModel;
  private host: string = '';

  constructor(parentNode: HTMLElement, langConfig: IChessLang, chessModel: ChessModel) {
    super(parentNode, 'div', [ chessConfigView.chessView.wrapper ]);
    this.model = chessModel;
    this.langConfig = langConfig.players;
    this.langConfigModals = langConfig.modals;
    this.chessView = chessConfigView.chessView;
    const chessControls = new Component(this.element, 'div', [ this.chessView.controls ]);
    const chessHead = new Component(this.element, 'div', [ this.chessView.head ]);
    this.playerOne = new Component(
      chessHead.element,
      'div',
      [ this.chessView.player ],
      this.langConfig.player1
    );
    this.timer = new Timer(chessHead.element);
    this.playerTwo = new Component(
      chessHead.element,
      'div',
      [ this.chessView.player ],
      this.langConfig.player2
    );
    const chessBody = new Component(this.element, 'div', [ this.chessView.body ]);
    this.history = new ChessHistoryBlock(
      chessBody.element,
      chessConfigView.history,
      langConfig.history
    );

    this.chessBoard = new ChessField(
      chessBody.element,
      chessConfigView.figure,
      chessConfigView.boardView,
      chessConfigView.gameField,
      configFigures
      // this.fromFen(fen)
    );

    this.btnStart = new ChessButton(
      chessControls.element,
      chessConfigView.btn,
      langConfig.controls.start
    );
    this.btnStart.buttonDisable();
    this.btnStart.onClick = () => {
      this.model.chessStartGame(this.host);
      // this.setFieldDragable();
      this.btnStart.buttonDisable();
      console.log('Start click');
      // this.onStartClick();
    };
    this.btnDraw = new ChessButton(
      chessControls.element,
      chessConfigView.btn,
      langConfig.controls.draw
    );
    this.btnDraw.onClick = () => {
      // this.createModalDraw();
      this.model.chessStopGame('draw');
      // this.onDrawClick();
    };
    this.btnLoss = new ChessButton(
      chessControls.element,
      chessConfigView.btn,
      langConfig.controls.loss
    );
    this.btnLoss.onClick = () => {
      // this.createModalLoss();
      this.model.chessStopGame('loss');
      // this.onLossClick();
    };

    this.chessBoard.onFigureDrop = (posStart: Vector, posDrop: Vector) => {
      this.model.chessMove(JSON.stringify([ posStart, posDrop ]));
    };

    this.chessBoard.onFigureGrab = (pos: Vector) => {
      this.model.chessFigureGrab(JSON.stringify(pos));
    };

    this.model.onChessMove.add((data) => this.onFigureMove(data));

    this.model.onStartGame.add((data) => this.createChessField(data));
    this.model.onStopGame.add((data) => this.createModalDraw(data));
    this.model.onChessFigureGrab.add((data) => this.showAllowedMoves(data));
  }

  updateGameField(rotate: boolean): void {
    if (rotate) {
      if (!this.isRotated) {
        this.chessBoard.element.classList.add('rotate');
      } else {
        this.chessBoard.element.classList.remove('rotate');
      }
      this.isRotated = !this.isRotated;
    }
  }

  clearData(fen: string) {
    this.players = 0;
    this.playerOne.element.textContent = this.langConfig.player1;
    this.playerTwo.element.textContent = this.langConfig.player2;
    this.chessBoard.clearData(this.fromFen(fen));
    this.timer.clear();
    this.destroy();
  }

  setPlayer(player: string): void {
    if (!this.players) {
      this.playerOne.element.textContent = player;
      this.host = player;
      this.players++;
    } else if (this.players === 1) {
      this.playerTwo.element.textContent = player;
      this.players++;
      this.btnStart.buttonEnable();
    }
  }

  setHistoryMove(coords: Array<ICellCoords>, figName: string): void {
    this.history.setHistoryMove(coords, this.timer.getTimeString(), figName);
  }

  setLangView(configLang: IChessLang): void {
    this.history.setLangView(configLang.history);
    this.langConfig = configLang.players;
    this.btnStart.setLangView(configLang.controls.start);
    this.btnDraw.setLangView(configLang.controls.draw);
    this.btnLoss.setLangView(configLang.controls.loss);
  }

  createModalDraw(status: boolean): void {
    if (status) {
      this.modalDraw = new ModalDraw(this.element, chessConfigView.modal, this.langConfigModals);
      this.modalDraw.onModalDrawClick = () => {
        this.model.chessRemoveGame('remove');
      };
    }
  }

  destroyModalDraw(): void {
    console.log('draw destroy');

    this.modalDraw.destroy();
  }

  createModalLoss(): void {
    this.modalLoss = new ModalLoss(this.element, chessConfigView.modal, this.langConfigModals);
    this.modalLoss.onModalLossClick = () => {
      console.log('destroy click');

      this.destroyModalLoss();
    };
  }

  destroyModalLoss(): void {
    this.modalLoss.destroy();
  }

  setFigurePosition(oldFigPos: Vector, newFigPos: Vector): void {
    this.chessBoard.setFigurePosition(oldFigPos, newFigPos);
  }

  showAllowedMoves(coords: Array<ICellCoords>): void {
    this.chessBoard.showAllowedMoves(coords);
  }

  removeAllowedMoves(): void {
    this.chessBoard.removeAlloweMoves();
  }

  onFigureMove(data: IChessData): void {
    console.log(data.field);

    const newField = this.fromFen(data.field);

    this.setHistoryMove(data.coords, data.figure);
    const oldFigPos = new Vector(data.coords[0].x, data.coords[0].y);
    const newFigPos = new Vector(data.coords[1].x, data.coords[1].y);

    this.setFigurePosition(oldFigPos, newFigPos);
    this.chessBoard.clearData(newField);

    this.updateGameField(data.rotate);
    this.removeAllowedMoves();
  }

  createChessField(data: IChessStart) {
    this.chessBoard.createFieldCells(this.fromFen(data.field));
    this.chessBoard.setDragable(true);
    this.timer.setTimer(data.time)
  }

  fromFen(fen: string): Array<string> {
    let fromFen: Array<string> = [];
    fen.split('/').join('').split('').forEach((el) => {
      if (!isNaN(+el)) {
        for (let i = 0; i < +el; i++) {
          fromFen.push('-');
        }
      } else fromFen.push(el);
    });
    return fromFen.join('').split('').map((item) => (item === '-' ? '' : item));
  }
}

export default ChessGame;
