import { Component } from '../utilities/Component';

class CrossButton extends Component {
  public onClick: () => void = () => {};

  constructor(parentNode: HTMLElement, btnContent: string) {
    super(parentNode, 'button', ['cross_button'], btnContent);
    this.element.onclick = () => {
      this.onClick();
    };
  }
}

export default CrossButton;
