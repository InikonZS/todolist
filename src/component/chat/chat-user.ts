import { IChatUser } from 'utilities/interfaces';
import { Component } from '../../utilities/Component';

class ChatUser extends Component {
  private userAvatar: Component;
  private userName: Component;
  constructor(parentNode: HTMLElement, avatar: string, userName: string, configView: IChatUser) {
    super(parentNode, 'div', [ configView.wrapper ]);
    this.userAvatar = new Component(this.element, 'div', [configView.avatar]);
    this.userAvatar.element.style.backgroundImage = `url(${avatar})`;
    this.userName = new Component(this.element, 'div', [configView.name]);
    this.userName.element.textContent = userName;
  }
}

export default ChatUser;
