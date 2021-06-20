import { Component } from '../../utilities/Component';

class ButtonDefault extends Component {
  public onClick: () => void = () => {};
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'button', [ 'default_button' ], 'Add');
    this.element.onclick = () => {
      this.onClick();
    };
  }
}

export default ButtonDefault;
