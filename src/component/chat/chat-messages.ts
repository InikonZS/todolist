import { Component } from '../../utilities/Component';
import { IChatMessageWrapper, IuserChatMessage } from '../../utilities/interfaces';
import ChatMessage from './chat-message';

class ChatMessagesBlock extends Component {
  private messages: Array<ChatMessage> = [];
  private config: IChatMessageWrapper;

  constructor(parentNode: HTMLElement, chatConfigView: IChatMessageWrapper) {
    super(parentNode, 'div', [ chatConfigView.wrapper ]);
    this.config = chatConfigView;
  }

  addMessage(message: IuserChatMessage): void {
    const messageItem = new ChatMessage( this.element, message, this.config.message);
    this.messages.push(messageItem);
  }
}

export default ChatMessagesBlock;
