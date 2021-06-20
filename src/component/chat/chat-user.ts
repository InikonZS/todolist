import { Component } from '../../utilities/Component';

class ChatUser extends Component {
  private userAvatar: Component;
  private userName: Component;
  constructor(parentNode: HTMLElement, avatar: string, userName: string) {
    super(parentNode, 'div', [ 'chat_user' ]);
    this.userAvatar = new Component(this.element, 'div', ['default_avatar_small']);
    this.userAvatar.element.style.backgroundImage = `url(${avatar})`;
    this.userName = new Component(this.element, 'div', ['default_name']);
    this.userName.element.textContent = userName;
  }
}

export default ChatUser;
