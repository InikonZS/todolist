import Button from './chess-button';
import { Component } from 'utilities/Component';
import { ILangViewModal, IModalPopup } from 'utilities/interfaces';



class ModalDraw extends Component {
  private modalMessage: Component;
  private messageHead: Component;
  private messageBody: Component;
  private btnOk: Button;
  public onModalDrawClick: () => void = () => {};

  constructor(parentNode: HTMLElement, config: IModalPopup, configLang: ILangViewModal, status: string, host: string, players: Array<string>) {
    super(parentNode, 'div', [ config.wrapper ]);
    this.modalMessage = new Component(this.element, 'div', [ config.message ]);
    const messageDraw = `Claim a draw. Nobody won, nobody lost`;
    const player = players.find(player => player !== host)
    const messageLoss = `Claim a loss. ${host} lost${player ? ', ' + player + ' won' : ''}`;
    
    this.messageHead = new Component(
      this.modalMessage.element,
      'div',
      [ config.text ],
    );
    this.messageBody = new Component(
      this.modalMessage.element,
      'div',
      [ config.text ],
    );
    this.messageBody.element.textContent = status === 'draw' ? messageDraw : messageLoss;
    this.btnOk = new Button(this.modalMessage.element, config.btn, configLang.btnContent);
    this.btnOk.element.onclick = () => {
      this.onModalDrawClick();
    };
  }

  setLangView(configLang: ILangViewModal): void {
    this.messageHead.element.textContent = configLang.gameOver;
    this.messageBody.element.textContent = configLang.draw;
    this.btnOk.setLangView(configLang.btnContent);
  }
}
export default ModalDraw;
