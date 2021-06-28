import { Component } from 'utilities/Component';
import { IFigure } from 'utilities/interfaces';
import Vector from 'utilities/vector';

class Figure extends Component {
  public onDragStart: (startPos: Vector) => void = () => {};
  private figurePos: Vector;
  private figPic: string;
  private isDragable: boolean = false;

  constructor(
    parentNode: HTMLElement,
    figure: string,
    configFigureView: IFigure,
    _figurePos: Vector,
    rotate: boolean
  ) {
    super(parentNode, 'div', [ configFigureView.wrapper ]);
    this.figurePos = _figurePos;
    this.figPic = figure;
    const inner = new Component(this.element, 'div', [configFigureView.inner]);
    inner.element.style.backgroundImage = `url(${figure})`;
    if(rotate) {
      this.element.classList.add('figure-rotate')
    }

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

  setFigureDragable(status: boolean): void {
    this.isDragable = status;
  }


}

export default Figure;
