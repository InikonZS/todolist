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
    rotate: boolean,
  ) {
    super(parentNode, 'div', [ configFigureView.wrapper ]);
    this.element.style.width = `${100 / 8}%`;
    this.element.style.height = `${100 / 8}%`;
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

  setFigureState(figPos: Vector): void {
    this.figurePos = figPos.clone();
    this.setFigurePosition(figPos);
  }

  getFigureState(): Vector {
    return this.figurePos.clone();
  }

  setFigurePosition(figPos: Vector): void {
    this.element.style.left = `${100 / 8 * figPos.x}%`;
    this.element.style.top = `${100 / 8 * figPos.y}%`;
  }

  setFigureDragable(status: boolean): void {
    this.isDragable = status;
  }


}

export default Figure;
