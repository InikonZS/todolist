import { Component } from 'utilities/Component';

class ChessButton extends Component {
  public onClick: () => void = () => {};
  constructor(parentNode: HTMLElement, btnContent: string) {
    super(parentNode, 'button', [ 'chess_button' ], btnContent);
    this.element.onclick = () => {
      this.onClick();
    };
  }
}

export default ChessButton;