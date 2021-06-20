import { Component } from '../../utilities/Component';
import { IuserChatMessage } from '../../utilities/interfaces';

class ChatMessage extends Component {
  constructor(parentNode: HTMLElement, message: IuserChatMessage) {
    super(parentNode, 'div', [ 'chat_message' ]);
    const messageWrapper = new Component(this.element, 'div', [ 'message_wrapper' ]);
    const messageAvatar = new Component(messageWrapper.element, 'div', [ 'message_avatar' ]);
    messageAvatar.element.style.backgroundImage = `url${message.avatar}`;
    const messageMain = new Component(messageWrapper.element, 'div', [ 'message_main' ]);

    const messageHeader = new Component(messageMain.element, 'div', [ 'message_header' ]);
    const messageUser = new Component(messageHeader.element, 'div', [ 'message_user' ]);
    messageUser.element.textContent = message.userName;
    const messageDate = new Component(messageHeader.element, 'div', [ 'message_date' ]);
    messageDate.element.textContent = message.time;

    const messageBody = new Component(messageMain.element, 'div', [ 'message_body' ]);
    messageBody.element.textContent = message.message;

  }
}

export default ChatMessage;
