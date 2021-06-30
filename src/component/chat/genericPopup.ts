import { Component } from 'utilities/Component';

export class GenericPopup<type> extends Component {
  popupWrapper: Component;

  onSelect: (value: type) => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['popup_blackout']);
    this.popupWrapper = new Component(this.element, 'div', ['popup_wrapper']);
  }

  destroy() {
    this.element.remove();
  }
}
