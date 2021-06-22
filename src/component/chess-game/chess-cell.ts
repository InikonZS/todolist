import { Component } from "utilities/Component";
import { ICellCoords } from "utilities/interfaces";

class ChessCell extends Component {
  public onCellClick: (coords: ICellCoords) => void = () => {};
  coords: { x: number; y: number };

  constructor(parentNode: HTMLElement, y: number, x: number) {
    super(parentNode, 'div', [ 'chess_cell' ]);
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

export default ChessCell;
