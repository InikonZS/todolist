import { Component } from "utilities/Component";
import Vector from "utilities/vector";


class Figure extends Component {
  public onDragStart: (startPos: Vector, figurePos: Vector) => void = () => {};
  private figurePos: Vector;

  constructor(parentNode: HTMLElement, figure: string, configFigureView: string, figurePos: Vector) {
    super(parentNode, 'div', [ configFigureView ]);
    this.figurePos = figurePos;
    this.element.style.backgroundImage = `url(${figure})`;

    this.element.onmousedown = (e) => {
      let startPos = new Vector(e.offsetX, e.offsetY);
      this.onDragStart && this.onDragStart(startPos, this.figurePos);
    };
    this.element.ondragstart = (e) => {
      e.preventDefault();
    };
  }

  getPos() {
    return this.figurePos;
  }
  setFigurePosition(figPos: Vector): void {
    this.figurePos = figPos;
  }
}

export default Figure;
