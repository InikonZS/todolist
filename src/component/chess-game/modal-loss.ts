import Button from './chess-button';
import { Component } from 'utilities/Component';
import { ILangViewModal, IModalPopup } from 'utilities/interfaces';

class ModalLoss extends Component {
  private modalMessage: Component;
  private messageHead: Component;
  private messageBody: Component;
  private btnOk: Button;
  public onModalLossClick: () => void = () => {};

  constructor(parentNode: HTMLElement, config: IModalPopup, configLang: ILangViewModal) {
    super(parentNode, 'div', [ config.wrapper ]);
    this.modalMessage = new Component(this.element, 'div', [ config.message ]);
    this.messageHead = new Component(
      this.modalMessage.element,
      'div',
      [ config.text ],
      configLang.gameOver
    );
    this.messageBody = new Component(
      this.modalMessage.element,
      'div',
      [ config.text ],
      configLang.draw
    );
    this.btnOk = new Button(this.modalMessage.element, config.btn, configLang.btnContent);
    this.btnOk.element.onclick = () => {
      this.onModalLossClick();
    };
  }

  setLangView(configLang: ILangViewModal): void {
    this.messageHead.element.textContent = configLang.gameOver;
    this.messageBody.element.textContent = configLang.draw;
    this.btnOk.setLangView(configLang.btnContent);
  }
}
export default ModalLoss;
