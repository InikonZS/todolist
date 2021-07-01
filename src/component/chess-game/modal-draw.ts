import { Component } from 'utilities/Component';
import { ILangViewModal, IModalPopup } from 'utilities/interfaces';
import Button from './chess-button';

class ModalDraw extends Component {
  private modalMessage: Component;

  private messageHead: Component;

  private messageBody: Component;

  private btnOk: Button;

  public onModalDrawClick: () => void = () => {};
  private btnAgree: Button;
  private btnDisagree: Button;

  constructor(
    parentNode: HTMLElement,
    config: IModalPopup,
    configLang: ILangViewModal,
    status: string,
    host: string,
    players: Array<string>,
    method: string
  ) {
    super(parentNode, 'div', [ config.wrapper ]);
    this.modalMessage = new Component(this.element, 'div', [ config.message ]);
    let messageDraw = 'Claim a draw. Nobody won, nobody lost';
    const player = players.find((player) => player !== host);
    let messageLoss = `Claim a loss. ${host} lost${player ? `, ${player} won` : ''}`;

    this.messageHead = new Component(this.modalMessage.element, 'div', [ config.text ]);
    this.messageBody = new Component(this.modalMessage.element, 'div', [ config.text ]);

    if (method === 'drawSingleGame') {
      messageDraw = 'You have claimed a draw. Nobody won, nobody lost';
      this.btnOk = new Button(this.modalMessage.element, config.btn, configLang.btnSingle);
      this.btnOk.onClick = () => {
        this.onModalDrawClick();
      };
    }

    if (method === 'drawNetwork') {
      messageDraw = `You have claimed a draw. Please wait your rival's response`;
    }

    if (method === 'drawAgreeNetwork') {
      messageDraw = 'Your rival has claimed a draw. Please make a choice';
      this.btnAgree = new Button(this.modalMessage.element, config.btn, configLang.btnAgree);
      this.btnAgree.onClick = () => {
        this.onModalDrawClick();
      };

      this.btnDisagree = new Button(this.modalMessage.element, config.btn, configLang.btnDisAgree);
      this.btnDisagree.onClick = () => {
        this.onModalDrawClick();
      };
    }

    this.messageBody.element.textContent = status === 'draw' ? messageDraw : messageLoss;
  }

  setLangView(configLang: ILangViewModal): void {
    this.messageHead.element.textContent = configLang.gameOver;
    this.messageBody.element.textContent = configLang.draw;
    this.btnOk && this.btnOk.setLangView(configLang.btnSingle);
    this.btnAgree && this.btnAgree.setLangView(configLang.btnAgree);
    this.btnDisagree && this.btnDisagree.setLangView(configLang.btnDisAgree);
  }
}
export default ModalDraw;
