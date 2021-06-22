import { Component } from "utilities/Component";
import Vector from "utilities/vector";


class Figure extends Component {
  public onDragStart: (startPos: Vector) => void = () => {};
  constructor(parentNode: HTMLElement, figure: string) {
    super(parentNode, 'div', [ 'drag-item' ]);
    this.element.style.backgroundImage = `url(${figure})`;

    this.element.onmousedown = (e) => {
      let startPos = new Vector(e.offsetX, e.offsetY);
      this.onDragStart && this.onDragStart(startPos);
    };
    this.element.ondragstart = (e) => {
      e.preventDefault();
    };
  }
}

export default Figure;
