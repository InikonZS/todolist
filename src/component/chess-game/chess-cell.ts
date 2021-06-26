import { Component } from "utilities/Component";
import { ICellCoords } from "utilities/interfaces";
import Vector from "utilities/vector";

class ChessCell extends Component {
  public onCellClick: (coords: ICellCoords) => void = () => {};
  coords: Vector;

  constructor(parentNode: HTMLElement, coords: Vector, configCell: Array<string>) {
    super(parentNode, 'div', configCell);
    this.coords = coords;
    this.element.onclick = () => {
      this.onCellClick(this.coords);
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

  setAllowedMove() {
    this.element.classList.add('valid_move');
  }

  removeAllowedMove() {
    this.element.classList.remove('valid_move');
  }

}

export default ChessCell;
