import { Component } from '../../utilities/Component';

class ChatInputWrapper extends Component {
  public onClick: (message: string) => void = () => {};
  public onEnter: (message: string) => void = () => {};
  private chatInput: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'chat_input' ]);
    this.chatInput = new Component(this.element, 'input', ['chat_input_field']);
    const inputBtn = new Component(this.element, 'button', ['chat_send_button'], 'Send');

    this.chatInput.element.onkeyup = (e) => {
      if (e.key == 'Enter') {
        this.onEnter((this.chatInput.element as HTMLInputElement).value);
      }
    }

    inputBtn.element.onclick = () => {
      this.onClick((this.chatInput.element as HTMLInputElement).value);
    }

  }

  clearInput(): void {
    (this.chatInput.element as HTMLInputElement).value = '';
  }
}

export default ChatInputWrapper;
