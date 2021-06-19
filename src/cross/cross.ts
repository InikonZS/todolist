import { Component } from './../component/Component';
import './cross.css';

export interface ICellCoords {
  x: number;
  y: number;
}

interface ICellData {
  x: number;
  y: number;
  sign: string;
}

let size = 3;

class Timer extends Component {
  private counter: number = 0;
  private count: number = 0;
  private time: number;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.element.textContent = this.count.toString();
  }
  start() {
    const start = Date.now();
    this.counter = window.setInterval(() => {
      this.time = Math.floor((Date.now() - start) / 1000);
      this.element.textContent = this.time.toString();
    }, 1000);
  }

  clear() {
    if (this.counter) {
      window.clearInterval(this.counter);
      this.counter = 0;
      this.element.textContent = '0';
    }
  }

  countDown() {
    this.count = 10;
    const start = Date.now();
    this.counter = window.setInterval(() => {
      if (this.count - this.time === 0) {
        this.clear();
        this.start();
      } else {
        this.time = Math.floor((Date.now() - start) / 1000);
        this.element.textContent = (this.count - this.time).toString();
      }
    }, 1000);
  }
}

class Cross extends Component {
  private cells: Array<Cell> = [];
  public onCellClick: (coords: ICellCoords) => void = () => {};
  timer: Timer;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'cross-board' ]);
    // this.model = new CrossModel();
    this.timer = new Timer(parentNode);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const cell = new Cell(this.element, i, j);
        cell.onCellClick = (coords: ICellCoords) => {
            this.onCellClick(coords);
        };
        this.cells.push(cell);
      }
    }
  }

  updateGetGameField(field: Array<string> ): void {
    this.cells.forEach((cell) => {
      const {x , y} = cell.getCellCoord();
      if(field[y][x]) {
        cell.clickedCell(field[y][x]);
      }
    })
    
  }

  clearData() {
    this.cells.forEach(cell => cell.clearCell());
  }

  startTimerCountDown() {
    this.timer.countDown();
  }
}

class Cell extends Component {
  public onCellClick: (coords: ICellCoords) => void = () => {};
  coords: { x: number; y: number };

  constructor(parentNode: HTMLElement, y: number, x: number) {
    super(parentNode, 'div', [ 'cross-cell' ]);
    this.coords = {
      x: x,
      y: y
    };
    this.element.onclick = () => {
      this.onCellClick({ x, y });
    };
  }

  getCellCoord(): ICellCoords {
    return this.coords;
  }

  clickedCell(sign: string) {
    this.element.classList.add('clicked');
    this.element.textContent = sign;
  }

  clearCell() {
    this.element.classList.remove('clicked');
    this.element.textContent = '';
  }
}

export default Cross;
