import { Component } from 'utilities/Component';
import Vector from 'utilities/vector';

class Figure extends Component {
  public onDragStart: (startPos: Vector) => void = () => {};
  private figurePos: Vector;
  figPic: string;

  constructor(
    parentNode: HTMLElement,
    figure: string,
    configFigureView: string,
    _figurePos: Vector
  ) {
    super(parentNode, 'div', [ configFigureView ]);
    this.figurePos = _figurePos;
    this.figPic = figure;
    this.element.style.backgroundImage = `url(${figure})`;

    this.element.onmousedown = (e) => {
      let startPos = new Vector(e.offsetX, e.offsetY);
      this.onDragStart(startPos);
    };
    this.element.ondragstart = (e) => {
      e.preventDefault();
    };
  }

  setFigureState(figPos: Vector, cellBox: DOMRect): void {
    this.figurePos = figPos.clone();
    this.setFigurePosition(figPos, cellBox);
  }

  getFigureState(): Vector {
    return this.figurePos.clone();
  }

  setFigurePosition(figPos: Vector, cellBox: DOMRect): void {
    this.element.style.left = figPos.x * cellBox.width + 'px';
    this.element.style.top = figPos.y * cellBox.height + 'px';
  }

}

export default Figure;
