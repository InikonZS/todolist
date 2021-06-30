import { Component } from '../../utilities/Component';

class ChatChannel extends Component {
  onClick: () => void = () => {};

  constructor(parentNode: HTMLElement, configView: string) {
    super(parentNode, 'div', [configView]);
    this.element.onclick = () => {
      this.onClick();
    };
  }
}

export default ChatChannel;
