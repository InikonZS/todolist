import { Component } from 'utilities/Component';
import { ILangViewControl } from 'utilities/interfaces';

class ChessButton extends Component {
  public onClick: () => void = () => {};
  constructor(parentNode: HTMLElement, btnConfig: string, btnContent: string) {
    super(parentNode, 'button', [ btnConfig ], btnContent);
    this.element.onclick = () => {
      this.onClick();
    };
  }
  setLangView(configLang: string):void {
    this.element.textContent = configLang;
  }

  buttonDisable(): void {
    this.element.setAttribute('disabled', 'true');
  }

  buttonEnable(): void {
    this.element.removeAttribute('disabled');
  }
}

export default ChessButton;