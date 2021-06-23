import { Component } from '../../utilities/Component';

class ButtonDefault extends Component {
  public onClick: () => void = () => {};
  constructor(parentNode: HTMLElement, configView: string, configLang: string) {
    super(parentNode, 'button', [ configView ], configLang);
    this.element.onclick = () => {
      this.onClick();
    };
  }

  buttonDisable(): void {
    this.element.setAttribute('disabled', 'true');
  }

  buttonEnable(): void {
    this.element.removeAttribute('disabled');
  }

  setLangView(configLang: string):void {
    this.element.textContent = configLang;
  }
}

export default ButtonDefault;
