import { Component } from '../../utilities/Component';
import { IuserChatMessage } from '../../utilities/interfaces';
import ChatMessage from './chat-message';

class ChatMessagesBlock extends Component {
  private messages: Array<ChatMessage> = [];

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'chat_messages' ]);
  }

  addMessage(message: IuserChatMessage): void {
    const messageItem = new ChatMessage( this.element, message);
    this.messages.push(messageItem);
  }
}

export default ChatMessagesBlock;
