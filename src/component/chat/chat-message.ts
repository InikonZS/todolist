import { Component } from '../../utilities/Component';
import { IChatMessage, IuserChatMessage } from '../../utilities/interfaces';

class ChatMessage extends Component {
  constructor(parentNode: HTMLElement, message: IuserChatMessage, chatConfig:IChatMessage) {
    super(parentNode, 'div', [ chatConfig.block ]);
    const messageWrapper = new Component(this.element, 'div', [ chatConfig.wrapper ]);
    const messageAvatar = new Component(messageWrapper.element, 'div', [ chatConfig.avatar ]);
    messageAvatar.element.style.backgroundImage = `url${message.avatar}`;
    const messageMain = new Component(messageWrapper.element, 'div', [ chatConfig.main ]);

    const messageHeader = new Component(messageMain.element, 'div', [ chatConfig.header ]);
    const messageUser = new Component(messageHeader.element, 'div', [ chatConfig.user ]);
    messageUser.element.textContent = message.userName;
    const messageDate = new Component(messageHeader.element, 'div', [ chatConfig.date ]);
    messageDate.element.textContent = message.time;

    const messageBody = new Component(messageMain.element, 'div', [ chatConfig.body ]);
    messageBody.element.textContent = message.message;

  }
}

export default ChatMessage;
