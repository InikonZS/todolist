import { IInputWrapper, IMessageBtn } from 'utilities/interfaces';
import { Component } from '../../utilities/Component';

class ChatInputWrapper extends Component {
  public onClick: (message: string) => void = () => {};

  public onEnter: (message: string) => void = () => {};

  private chatInput: Component;

  private inputBtn: Component;

  constructor(parentNode: HTMLElement, configView: IInputWrapper, configLang: IMessageBtn) {
    super(parentNode, 'div', [configView.wrapper]);
    this.chatInput = new Component(this.element, 'input', [configView.field]);
    this.inputBtn = new Component(this.element, 'button', [configView.button], configLang.btn);

    this.chatInput.element.onkeyup = (e) => {
      if (e.key == 'Enter') {
        this.onEnter((this.chatInput.element as HTMLInputElement).value);
      }
    };

    this.inputBtn.element.onclick = () => {
      this.onClick((this.chatInput.element as HTMLInputElement).value);
    };
  }

  clearInput(): void {
    (this.chatInput.element as HTMLInputElement).value = '';
  }

  setLangView(configLang: string):void {
    this.inputBtn.element.textContent = configLang;
  }
}

export default ChatInputWrapper;
