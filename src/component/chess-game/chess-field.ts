import Vector from 'utilities/vector';
import { Component } from 'utilities/Component';
import Figure from './chess-figure';
import configField from 'utilities/config-chess';
import { IBoardCellView, IGameField } from 'utilities/interfaces';

class ChessField extends Component {
  private dragableItems: Component;
  private dragableField: Component;
  private testItem: Component;
  private items: Array<Figure> = [];
  onCellDrop: (item: Component, coords: Vector) => void = () => {};
  private startChildPos: Vector;
  public onFigureDrop: (posStart: Vector, posDrop: Vector) => void = () => {};
  private startCellPos: Vector;
  public onFigureGrab: (pos: Vector) => void = () => {};

  constructor(parentNode: HTMLElement, configFigure: string, configBoardView:IBoardCellView, configFieldView: IGameField) {
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
    this.dragableField = new Component(this.element, 'div', [ 'chess_field' ]);
    for (let i = 0; i < 64; i++) {
      let cell = new Component(this.dragableField.element, 'div', [ configFieldView.cell ]);
      this.addItem(new Figure(null, configField[i], configFigure), i, cell.element.getBoundingClientRect());
      cell.element.onmouseenter = () => {
        cell.element.classList.add(configFieldView.hover);
      };
      cell.element.onmouseleave = () => {
        cell.element.classList.remove(configFieldView.hover);
      };
      cell.element.onmouseup = () => {
        this.onCellDrop && this.onCellDrop(this.testItem, new Vector(i % 8, Math.floor(i / 8)));
        const cellPos = new Vector(i % 8, Math.floor(i / 8));
        const cellBox = cell.element.getBoundingClientRect();
        this.testItem.element.style.left = cellPos.x * cellBox.width + 'px';
        this.testItem.element.style.top = cellPos.y * cellBox.height + 'px';
        this.onFigureDrop(this.startCellPos, cellPos);
      };
    }
    this.dragableField.element.style.display = 'none';
    this.testItem = null;
    this.element.onmousedown = (e) => {
      e.preventDefault();
      if (e.buttons == 1) {
        const fieldBox = this.dragableField.element.getBoundingClientRect();
        const ratio = Math.floor(fieldBox.width / 8);
        this.startCellPos = new Vector(
          Math.floor((e.clientX - this.element.offsetLeft) / ratio),
          Math.floor((e.clientY - this.element.offsetTop) / ratio)
        );
        this.onFigureGrab(this.startCellPos);
      }
    };

    this.element.onmouseenter = (e: MouseEvent) => {
      if (e.buttons != 1) {
        this.dragableField.element.onmouseup(e);
      }
    };

    this.dragableField.element.onmousemove = (e: MouseEvent) => {
      if (e.buttons == 1) {
        if (this.testItem) {
          let movePos = new Vector(
            e.clientX - this.element.offsetLeft,
            e.clientY - this.element.offsetTop
          ).sub(this.startChildPos);
          this.testItem.element.style.left = movePos.x + 'px';
          this.testItem.element.style.top = movePos.y + 'px';
        }
      }
    };

    this.dragableField.element.onmouseup = (e) => {
      this.dragableField.element.style.display = 'none';
      this.testItem = null;
    };
  }

  addItem(instance: Figure, i: number, parentNode: DOMRect): void {
    const figPos = new Vector(i % 8, Math.floor(i / 8));
    let testItem = instance;
    this.dragableItems.element.appendChild(testItem.element);
    testItem.element.style.left = figPos.x * parentNode.width + 'px';
    testItem.element.style.top = figPos.y * parentNode.height + 'px';
    testItem.onDragStart = (startPos: Vector) => {
      this.dragableField.element.style.display = '';
      this.startChildPos = startPos;
      this.testItem = testItem;
    };
    this.items.push(testItem);
  }
}

export default ChessField;
