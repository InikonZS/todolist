import { Component } from '../../utilities/Component';

class ChatChannel extends Component {
  onClick: () => void = () => {};

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'chat_channel' ]);
    this.element.onclick = () => {
      this.onClick();
    };
  }
}

export default ChatChannel;
