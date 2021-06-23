import { Component } from 'utilities/Component';
import { ICellCoords, IChessLang, IChessView, ILangView, ILangViewModal, ILangViewPlayer } from 'utilities/interfaces';
import ChessCell from './chess-cell';
import ChessButton from './chess-button';
import './chess-game.css';
import ChessHistoryBlock from './chess-history';
import ChessField from './chess-field';
import Vector from 'utilities/vector';
import { chessConfigView } from 'utilities/config-chess';
import ModalDraw from './modal-draw';
import ModalLoss from './modal-loss';

let size = 8;
class Timer extends Component {
  private counter: number = 0;
  private count: number = 10;
  private time: number;
  private startTime: number = 0;
  private isPlaying: boolean = false;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'cross_timer' ]);
    this.element.textContent = '00:10';
  }
  start() {
    this.counter = window.setInterval(() => {
      this.time = Math.floor((Date.now() - this.startTime) / 1000);
      this.element.textContent = this.getTimeString();
    }, 1000);
  }

  clear() {
    if (this.counter) {
      window.clearInterval(this.counter);
      this.counter = 0;
      this.element.textContent = '00:00';
      this.startTime += 11000;
    }
  }

  countDown() {
    this.counter = window.setInterval(() => {
      if (this.count - this.time === 0) {
        this.clear();
        this.start();
        this.isPlaying = true;
      } else {
        this.time = Math.floor((Date.now() - this.startTime) / 1000);
        this.element.textContent = this.getCountDownString();
      }
    }, 1000);
  }

  setTimer(startTime: number) {
    this.startTime = startTime;
    this.time = startTime;
    this.countDown();
  }

  getCountDownString(): string {
    const seconds = Math.floor((this.count - this.time) % 60);

    const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `00:${secOutput}`;
  }

  getTimeString(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = Math.floor(this.time % 60);

    const minOutput = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minOutput}:${secOutput}`;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

class Cross extends Component {
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
  public onFigureDrop: (posStart:Vector, posDrop:Vector) => void = () => {};
  public onFigureGrab: (pos: Vector) => void = () => {};
  private chessView: IChessView;
  private langConfig: ILangViewPlayer;
  private modalDraw: ModalDraw;
  private langConfigModals: ILangViewModal;
  public onModalDrawClick: () => void = () => {};
  private modalLoss: ModalLoss;
  public onModalLossClick: () => void = () => {};

  constructor(parentNode: HTMLElement, langConfig:IChessLang) {
    super(parentNode, 'div', [ chessConfigView.chessView.wrapper ]);
    this.langConfig = langConfig.players;
    this.langConfigModals = langConfig.modals;
    this.chessView = chessConfigView.chessView;
    const chessControls =  new Component(this.element, 'div', [ this.chessView.controls ]);
    const chessHead = new Component(this.element, 'div', [ this.chessView.head ]);
    this.playerOne = new Component(chessHead.element, 'div', [ this.chessView.player ], this.langConfig.player1);
    this.timer = new Timer(chessHead.element);
    this.playerTwo = new Component(chessHead.element, 'div', [ this.chessView.player ], this.langConfig.player2);
    const chessBody = new Component(this.element, 'div', [ this.chessView.body ]);
    this.history = new ChessHistoryBlock(chessBody.element, chessConfigView.history, langConfig.history);

    this.chessBoard = new ChessField(chessBody.element, chessConfigView.figure, chessConfigView.boardView, chessConfigView.gameField);

    this.btnStart = new ChessButton(chessControls.element, chessConfigView.btn, langConfig.controls.start);
    this.btnStart.buttonDisable();
    this.btnStart.onClick = () => {
      this.onStartClick();

    }
    this.btnDraw = new ChessButton(chessControls.element, chessConfigView.btn, langConfig.controls.draw);
    this.btnDraw.onClick = () => {
      this.onDrawClick();
      
    }
    this.btnLoss = new ChessButton(chessControls.element, chessConfigView.btn, langConfig.controls.loss);
    this.btnLoss.onClick = () => {
      this.onLossClick();
    }

    this.chessBoard.onFigureDrop = (posStart:Vector, posDrop:Vector) => {
      this.onFigureDrop(posStart, posDrop)
    }

    this.chessBoard.onFigureGrab = (pos:Vector) => {
      this.onFigureGrab(pos)
    }
  }

  updateGameField(field: Array<string>): void {
    this.cells.forEach((cell) => {
      const { x, y } = cell.getCellCoord();
      if (field[y][x]) {
        cell.clickedCell(field[y][x]);
      }
    });
    if (!this.isRotated) {
      this.chessBoard.element.classList.add('rotate');
    } else {
      this.chessBoard.element.classList.remove('rotate');
    }
    this.isRotated = !this.isRotated;
  }

  clearData() {
    this.cells.forEach((cell) => cell.clearCell());
    this.players = 0;
    this.playerOne.element.textContent = this.langConfig.player1;
    this.playerTwo.element.textContent = this.langConfig.player2;
    this.timer.clear();
  }

  setPlayer(player: string): void {

    if (!this.players) {
      this.playerOne.element.textContent = player;
      this.players++;
    } else if (this.players === 1) {
      this.playerTwo.element.textContent = player;
      this.players++;
      this.btnStart.buttonEnable();
    }
  }

  setHistoryMove(coords: Array<ICellCoords>): void {
    this.history.setHistoryMove(coords, '');
  }

  setLangView(configLang: IChessLang):void {
    this.history.setLangView(configLang.history);
    this.langConfig = configLang.players;
    this.btnStart.setLangView(configLang.controls.start);
    this.btnDraw.setLangView(configLang.controls.draw);
    this.btnLoss.setLangView(configLang.controls.loss);
  }

  createModalDraw():void {
    this.modalDraw = new ModalDraw(this.element, chessConfigView.modal, this.langConfigModals);
    this.modalDraw.onModalDrawClick = () => {
      this.onModalDrawClick();
    }
  }

  destroyModalDraw():void {
    this.modalDraw.destroy();
  }

  createModalLoss():void {
    this.modalLoss = new ModalLoss(this.element, chessConfigView.modal, this.langConfigModals);
    this.modalLoss.onModalLossClick = () => {
      this.onModalLossClick();
    }
  }

  destroyModalLoss():void {
    this.modalLoss.destroy();
  }
}

export default Cross;
