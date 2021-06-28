import { Component } from "utilities/Component";
import { ICellConfig, ICellCoords } from "utilities/interfaces";
import Vector from "utilities/vector";

class ChessCell extends Component {
  public onCellClick: (coords: ICellCoords) => void = () => {};
  private coords: Vector;
  private configCell: ICellConfig;

  constructor(parentNode: HTMLElement, coords: Vector, configCell: ICellConfig, cellColor: string) {
    super(parentNode, 'div', [configCell.cell]);
    this.element.classList.add(cellColor);
    this.configCell = configCell;
    this.coords = coords;
    
    this.element.onclick = () => {
      this.onCellClick(this.coords);
    };
  }

  getCellCoord(): Vector {
    return this.coords;
  }

  clickedCell(sign: string): void {
    this.element.classList.add('clicked');
    this.element.textContent = sign;
  }

  clearCell(): void {
    this.element.classList.remove('clicked');
    this.element.textContent = '';
  }

  setAllowedMove(): void {
    this.element.classList.add(this.configCell.validMove);
    console.log(this.configCell.validMove);
    
  }

  removeAllowedMove(): void {
    this.element.classList.remove(this.configCell.validMove);
  }

  setKingCell(): void {
    this.element.classList.add(this.configCell.kingCell);
  }

  removeKingCell(): void {
    this.element.classList.remove(this.configCell.kingCell);
  }
}

export default ChessCell;
