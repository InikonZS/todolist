import { Component } from '../utilities/Component';
import { ICellCoords } from '../utilities/interfaces';
import Cell from './cell';
import './cross.css';
import HistoryBlock from './history';

let size = 3;
class Timer extends Component {
  private counter: number = 0;
  private count: number = 10;
  private time: number;
  private startTime: number = 0;
  private isPlaying: boolean = false;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'cross_timer' ]);
    this.element.textContent = '00:00';
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
  private cells: Array<Cell> = [];
  public onCellClick: (coords: ICellCoords) => void = () => {};
  timer: Timer;
  history: HistoryBlock;
  private playerOne: Component;
  private playerTwo: Component;
  private players: number = 0;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'cross_wrapper' ]);
    const crossHead = new Component(this.element, 'div', [ 'cross_head' ]);
    this.playerOne = new Component(crossHead.element, 'div', [ 'cross_player' ], 'Player1');
    this.timer = new Timer(crossHead.element);
    this.playerTwo = new Component(crossHead.element, 'div', [ 'cross_player' ], 'Player2');
    const crossBody = new Component(this.element, 'div', [ 'cross_body' ]);
    this.history = new HistoryBlock(crossBody.element);

    const crossCells = new Component(crossBody.element, 'div', [ 'cross_cells' ]);
    for (let i = 0; i < size; i++) {
      const row = new Component(crossCells.element, 'div', [ 'cross_row' ]);
      for (let j = 0; j < size; j++) {
        const cell = new Cell(row.element, i, j);
        cell.onCellClick = (coords: ICellCoords) => {
          if (this.timer.getIsPlaying()) {
            this.onCellClick(coords);
          }
        };
        this.cells.push(cell);
      }
    }
  }

  updateGameField(field: Array<string>): void {
    this.cells.forEach((cell) => {
      const { x, y } = cell.getCellCoord();
      if (field[y][x]) {
        cell.clickedCell(field[y][x]);
      }
    });
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

  setHistoryMove(sign: string, coords: ICellCoords, time: string): void {
    this.history.setHistoryMove(sign, coords, this.timer.getTimeString());
  }
}

export default Cross;
