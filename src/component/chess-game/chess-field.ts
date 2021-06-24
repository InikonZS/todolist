import Vector from 'utilities/vector';
import { Component } from 'utilities/Component';
import Figure from './chess-figure';
import configField from 'utilities/config-chess';
import { IBoardCellView, IGameField } from 'utilities/interfaces';

class ChessField extends Component {
  private dragableItems: Component;
  private dragableField: Component;
  private figure: Component;
  private items: Array<Figure> = [];
  onCellDrop: (item: Component, coords: Vector) => void = () => {};
  private startChildPos: Vector;
  public onFigureDrop: (posStart: Vector, posDrop: Vector) => void = () => {};
  private startCellPos: Vector;
  public onFigureGrab: (pos: Vector) => void = () => {};
  private currentFigPos: Vector;

  constructor(
    parentNode: HTMLElement,
    configFigure: string,
    configBoardView: IBoardCellView,
    configFieldView: IGameField
  ) {
    super(parentNode, 'div', [ configFieldView.board ]);
    const boardView = new Component(this.element, 'div', [ configBoardView.boardView ]);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (i % 2 === 0) {
          let cell = new Component(boardView.element, 'div', [
            configBoardView.cell,
            j % 2 === 0 ? configBoardView.light : configBoardView.dark
          ]);
        } else if (i % 2 !== 0) {
          let cell = new Component(boardView.element, 'div', [
            configBoardView.cell,
            j % 2 === 0 ? configBoardView.dark : configBoardView.light
          ]);
        }
      }
    }
    this.dragableItems = new Component(this.element, 'div');
    this.dragableField = new Component(this.element, 'div', [ configFieldView.field ]);
    for (let i = 0; i < 64; i++) {
      let cell = new Component(this.dragableField.element, 'div', [ configFieldView.cell ]);
      this.addItem(
        new Figure(null, configField[i], configFigure, new Vector(i % 8, Math.floor(i / 8))),
        i,
        cell.element.getBoundingClientRect()
      );
      cell.element.onmouseenter = () => {
        cell.element.classList.add(configFieldView.hover);
      };
      cell.element.onmouseleave = () => {
        cell.element.classList.remove(configFieldView.hover);
      };
      cell.element.onmouseup = () => {
        this.onCellDrop && this.onCellDrop(this.figure, new Vector(i % 8, Math.floor(i / 8)));
        const cellPos = new Vector(i % 8, Math.floor(i / 8));
        const cellBox = cell.element.getBoundingClientRect();
        this.figure.element.style.left = cellPos.x * cellBox.width + 'px';
        this.figure.element.style.top = cellPos.y * cellBox.height + 'px';
        // this.onFigureDrop(this.startCellPos, cellPos);
        this.onFigureDrop(this.currentFigPos, cellPos);
      };
    }
    this.dragableField.element.style.display = 'none';
    this.figure = null;
    this.element.onmousedown = (e) => {
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
      // this.onFigureGrab(this.startCellPos);
      this.onFigureGrab(this.currentFigPos);
    };

    this.element.onmouseenter = (e: MouseEvent) => {
      if (e.buttons != 1) {
        this.dragableField.element.onmouseup(e);
      }
    };

    this.dragableField.element.onmousemove = (e: MouseEvent) => {
      if (window.getComputedStyle(this.element).transform !== 'none' && e.buttons == 1) {
        if (this.figure) {
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
          this.figure.element.style.left = movePos.x + 'px';
          this.figure.element.style.top = movePos.y + 'px';
        }
      } else if (e.buttons == 1) {
        if (this.figure) {
          let movePos = new Vector(
            e.clientX - this.element.offsetLeft,
            e.clientY - this.element.offsetTop
          ).sub(this.startChildPos);
          this.figure.element.style.left = movePos.x + 'px';
          this.figure.element.style.top = movePos.y + 'px';
        }
      }
    };

    this.dragableField.element.onmouseup = (e) => {
      this.dragableField.element.style.display = 'none';
      this.figure = null;
    };
  }

  addItem(instance: Figure, i: number, parentNode: DOMRect): void {
    const figPos = new Vector(i % 8, Math.floor(i / 8));
    let figure = instance;

    this.dragableItems.element.appendChild(figure.element);
    figure.element.style.left = figPos.x * parentNode.width + 'px';
    figure.element.style.top = figPos.y * parentNode.height + 'px';
    figure.onDragStart = (startPos: Vector, figPos: Vector) => {
      this.dragableField.element.style.display = '';
      this.startChildPos = startPos;
      this.currentFigPos = figPos;
      this.figure = figure;
    };
    this.items.push(figure);
  }
}

export default ChessField;
