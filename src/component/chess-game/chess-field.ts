import Vector from 'utilities/vector';
import { Component } from 'utilities/Component';
import Figure from './chess-figure';
import configField, { configFigures, fen } from 'utilities/config-chess';
import { IBoardCellView, IGameField, ICellCoords } from 'utilities/interfaces';
import ChessCell from './chess-cell';
import { chessModeConfig } from '../chat/chatPage';

class ChessField extends Component {
  private dragableItems: Component;
  private dragableField: Component = null;
  private figure: Figure;
  private items: Array<Figure> = [];
  onCellDrop: (item: Component, coords: Vector) => void = () => {};
  private startChildPos: Vector;
  public onFigureDrop: (posStart: Vector, posDrop: Vector) => void = () => {};
  private startCellPos: Vector;
  public onFigureGrab: (pos: Vector) => void = () => {};
  private cellBox: DOMRect;
  private isDragable: boolean = false;
  private cells: Array<ChessCell> = [];
  private configBoardView: IBoardCellView;
  private configFieldView: IGameField;
  private configFigure: string;
  private configFigures: Map<string, string>;
  private chessMode: string = '';

  constructor(
    parentNode: HTMLElement,
    configFigure: string,
    configBoardView: IBoardCellView,
    configFieldView: IGameField,
    configFigures: Map<string, string>
  ) {
    super(parentNode, 'div', [ configFieldView.board ]);
    this.configBoardView = configBoardView;
    this.configFieldView = configFieldView;
    this.configFigure = configFigure;
    this.configFigures = configFigures;

    const boardView = new Component(this.element, 'div', [ configBoardView.boardView ]);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let color = '';
        if (i % 2 === 0) {
          color = j % 2 === 0 ? configBoardView.light : configBoardView.dark;
          let cell = new ChessCell(boardView.element, new Vector(j, i), [
            configBoardView.cell,
            color
          ]);
          this.cells.push(cell);
        } else if (i % 2 !== 0) {
          color = j % 2 === 0 ? configBoardView.dark : configBoardView.light;
          let cell = new ChessCell(boardView.element, new Vector(j, i), [
            configBoardView.cell,
            color
          ]);
          this.cells.push(cell);
        }
      }
    }

    this.figure = null;
    this.element.onmousedown = (e) => {
      if (this.isDragable && this.figure) {
        this.onFigureDropOnCell(e);
        this.onFigureGrab(this.figure.getFigureState());
      }
    };
  }

  createFieldCells(fen: Array<string>): void {
    this.dragableItems = new Component(this.element, 'div');
    this.dragableField = new Component(this.element, 'div', [ this.configFieldView.field ]);

    for (let i = 0; i < 64; i++) {
      let cell = new Component(this.dragableField.element, 'div', [ this.configFieldView.cell ]);
      this.cellBox = cell.element.getBoundingClientRect();
      const cellCoord = new Vector(i % 8, Math.floor(i / 8));
      if (fen[i]) {
        const fig = fen[i];
        let rotate = false;
        if (this.chessMode === chessModeConfig.oneScreen) {
          rotate = fen[i] === fen[i].toUpperCase() ? false : true;
        }

        this.addItem(
          // new Figure(null, configField[i], this.configFigure, cellCoord),
          new Figure(null, this.configFigures.get(fen[i]), this.configFigure, cellCoord, rotate),
          i,
          cell.element.getBoundingClientRect()
        );
      }

      cell.element.onmouseenter = () => {
        cell.element.classList.add(this.configFieldView.hover);
      };
      cell.element.onmouseleave = () => {
        cell.element.classList.remove(this.configFieldView.hover);
      };
      cell.element.onmouseup = () => {
        this.onCellDrop && this.onCellDrop(this.figure, new Vector(i % 8, Math.floor(i / 8)));
        const cellPos = new Vector(i % 8, Math.floor(i / 8));
        this.onFigureDrop(this.figure.getFigureState(), cellPos);
        this.setDragable(false);
      };
    }
    this.dragableField.element.style.display = 'none';
    this.dragableField.element.onmousemove = (e: MouseEvent) => {
      if (window.getComputedStyle(this.element).transform !== 'none' && e.buttons == 1) {
        if (this.figure) {
          this.onFigureMoveWithTransform(e);
        }
      } else if (e.buttons == 1) {
        this.onFigureMoveWithoutTransform(e);
      }
    };

    this.dragableField.element.onmouseup = (e) => {
      this.dragableField.element.style.display = 'none';
      // this.figure = null;
    };
    this.element.onmouseenter = (e: MouseEvent) => {
      if (e.buttons != 1) {
        this.dragableField.element.onmouseup(e);
      }
    };
  }

  addItem(instance: Figure, i: number, parentNode: DOMRect): void {
    const figPos = new Vector(i % 8, Math.floor(i / 8));
    let figure = instance;

    this.dragableItems.element.appendChild(figure.element);
    figure.setFigurePosition(figPos, parentNode);
    figure.onDragStart = (startPos: Vector) => {
      if (this.isDragable) {
        this.dragableField.element.style.display = '';
        this.startChildPos = startPos;
        this.figure = figure;
      }
    };
    this.items.push(figure);
  }

  onFigureMoveWithTransform(e: MouseEvent) {
    const trasformOrigin = window
      .getComputedStyle(this.element)
      .transformOrigin.split(' ')
      .map((item) => Number(parseFloat(item)));
    const origin = new Vector(trasformOrigin[0], trasformOrigin[1]);
    let x = Math.floor(e.clientX - this.element.offsetLeft);
    let y = Math.floor(e.clientY - this.element.offsetTop);
    const mousePos = new Vector(x, y).sub(origin);

    const matrix = window
      .getComputedStyle(this.element)
      .transform.slice(7, -1)
      .split(', ')
      .map((item) => Number(item));

    x = matrix[0] * mousePos.x + matrix[1] * mousePos.y;
    y = matrix[2] * mousePos.x + matrix[3] * mousePos.y;
    let movePos = new Vector(x, y).sub(this.startChildPos).add(origin);
    // this.figure.setFigurePosition(movePos, this.cellBox);
    this.figure.element.style.left = movePos.x + 'px';
    this.figure.element.style.top = movePos.y + 'px';
  }

  onFigureMoveWithoutTransform(e: MouseEvent) {
    if (this.figure) {
      let movePos = new Vector(
        e.clientX - this.element.offsetLeft,
        e.clientY - this.element.offsetTop
      ).sub(this.startChildPos);
      this.figure.element.style.left = movePos.x + 'px';
      this.figure.element.style.top = movePos.y + 'px';
    }
  }

  onFigureDropOnCell(e: MouseEvent) {
    e.preventDefault();
    const fieldBox = this.dragableField.element.getBoundingClientRect();
    const ratio = Math.floor(fieldBox.width / 8);
    if (window.getComputedStyle(this.element).transform !== 'none' && e.buttons == 1) {
      const matrix = window
        .getComputedStyle(this.element)
        .transform.slice(7, -1)
        .split(', ')
        .map((item) => Number(item));
      let x = Math.floor((e.clientX - this.element.offsetLeft) / ratio);
      let y = Math.floor((e.clientY - this.element.offsetTop) / ratio);

      x = matrix[0] * x + matrix[1] * y;
      y = matrix[2] * x + matrix[3] * y;
      this.startCellPos = new Vector(Math.floor(x), Math.floor(y));
    } else if (e.buttons == 1) {
      this.startCellPos = new Vector(
        Math.floor((e.clientX - this.element.offsetLeft) / ratio),
        Math.floor((e.clientY - this.element.offsetTop) / ratio)
      );
    }
  }

  setFigurePosition(oldFigPos: Vector, newFigPos: Vector): void {
    const figItem = this.items.find(
      (figure) =>
        figure.getFigureState().x === oldFigPos.x && figure.getFigureState().y === oldFigPos.y
    );
    figItem.setFigureState(newFigPos, this.cellBox);
    this.isDragable = true;
    console.log(this.isDragable);
  }

  setDragable(status: boolean): void {
    this.isDragable = status;
  }

  showAllowedMoves(coords: Array<ICellCoords>): void {
    coords.forEach((coord) => {
      this.cells.forEach((cell) => {
        if (cell.getCellCoord().x === coord.x && cell.getCellCoord().y === coord.y) {
          cell.setAllowedMove();
        }
      });
    });
  }

  removeAlloweMoves(): void {
    this.cells.forEach((cell) => cell.removeAllowedMove());
  }

  clearData(fen: Array<string>): void {
    this.dragableItems.destroy();
    this.dragableField.destroy();
    this.createFieldCells(fen);
    // this.isDragable = false;
  }

  setChessMode(chessMode: string): void {
    this.chessMode = chessMode;
  }
}

export default ChessField;
