import { Component } from 'utilities/Component';
import { ICellCoords } from 'utilities/interfaces';
import ChessCell from './chess-cell';
import ChessButton from './chess-button';
import './chess-game.css';
import ChessHistoryBlock from './chess-history';
import ChessField from './chess-field';
import Vector from 'utilities/vector';

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


  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'chess_wrapper' ]);
    const chessControls =  new Component(this.element, 'div', [ 'chess_controls' ]);
    const chessHead = new Component(this.element, 'div', [ 'chess_head' ]);
    this.playerOne = new Component(chessHead.element, 'div', [ 'chess_player' ], 'Player1');
    this.timer = new Timer(chessHead.element);
    this.playerTwo = new Component(chessHead.element, 'div', [ 'chess_player' ], 'Player2');
    const chessBody = new Component(this.element, 'div', [ 'chess_body' ]);
    this.history = new ChessHistoryBlock(chessBody.element);

    this.chessBoard = new ChessField(chessBody.element);

    // for (let i = 0; i < size; i++) {
      // const row = new Component(this.crossCells.element, 'div', [ 'cross_row' ]);
      // for (let j = 0; j < size; j++) {
      //   const cell = new ChessCell(row.element, i, j);
      //   cell.onCellClick = (coords: ICellCoords) => {
      //     if (this.timer.getIsPlaying()) {
      //       this.onCellClick(coords);
      //     }
      //   };
      //   this.cells.push(cell);
      // }
      // for (let i = 0; i < 64; i++) {
      //   const cell = new ChessCell(chessBody.element, i, j);
        
      // }

    this.btnStart = new ChessButton(chessControls.element, 'Start');
    this.btnStart.onClick = () => {
      this.onStartClick();
    }
    this.btnDraw = new ChessButton(chessControls.element, 'Draw');
    this.btnDraw.onClick = () => {
      this.onDrawClick();
    }
    this.btnLoss = new ChessButton(chessControls.element, 'Loss');
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
    this.playerOne.element.textContent = 'Player1';
    this.playerTwo.element.textContent = 'Player2';
    this.timer.clear();
  }

  setPlayer(player: string, time: number): void {
    console.log(time);

    if (!this.players) {
      this.playerOne.element.textContent = player;
      this.players++;
    } else if (this.players === 1) {
      this.playerTwo.element.textContent = player;
      this.players++;
      this.timer.setTimer(time);
    }
  }

  setHistoryMove(coords: Array<ICellCoords>): void {
    this.history.setHistoryMove(coords, '');
  }
}

export default Cross;
