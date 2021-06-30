import { Component } from '../utilities/Component';

export class ControlPanel extends Component {
  private button: Component;

  public onAddClick: (() => void) | null = null;

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'span', ['new-task__wrapper']);

    this.button = new Component(this.element, 'button', ['button', 'new-task__button'], 'ADD');
    this.button.element.onclick = () => {
      this.onAddClick?.();
    };
  }
}
