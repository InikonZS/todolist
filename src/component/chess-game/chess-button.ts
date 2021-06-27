import { Component } from 'utilities/Component';
import { IChessBtn, ILangViewControl } from 'utilities/interfaces';

class ChessButton extends Component {
  public onClick: () => void = () => {};
  private btnConfig: IChessBtn;
  constructor(parentNode: HTMLElement, btnConfig: IChessBtn, btnContent: string) {
    super(parentNode, 'button', [ btnConfig.btnEnabled ], btnContent);
    this.btnConfig = btnConfig;
    this.element.onclick = () => {
      this.onClick();
    };
  }
  setLangView(configLang: string):void {
    this.element.textContent = configLang;
  }

  buttonDisable(): void {
    this.element.setAttribute('disabled', 'true');
    this.element.classList.add(this.btnConfig.btnDisabled);
  }

  buttonEnable(): void {
    this.element.removeAttribute('disabled');
    this.element.classList.remove(this.btnConfig.btnDisabled);
  }
}

export default ChessButton;