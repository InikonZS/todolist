import Button from "./button";
import { Component } from "utilities/Component";
import { GenericPopup } from "./genericPopup";

export class ChessGameSettings extends GenericPopup<{mode: string}> {
  // popupLayer: Component;
  // popupBlackout: Component;
  // popupWrapper: Component;

  // onSelect: (value: {mode: string}) => void;

  buttonOneScreen: Button;
  buttonNetwork: Button;
  buttonBot: Button;
  constructor(parentNode: HTMLElement) {
    super(parentNode)
    // super(parentNode, 'div', ['popup_blackout']);

    // this.popupWrapper = new Component(this.element, 'div',['popup_wrapper']);

    this.buttonOneScreen = new Button(this.popupWrapper.element, 'popup_default_button', 'One Screen');
    this.buttonNetwork = new Button(this.popupWrapper.element, 'popup_default_button', 'Network');
    this.buttonBot = new Button(this.popupWrapper.element, 'popup_default_button', 'Bot');

    this.buttonOneScreen.onClick = () => {
      this.onSelect({mode: 'oneScreen'});
    }

    this.buttonNetwork.onClick = () => {
      this.onSelect({mode: 'network'});
    }

    this.buttonBot.onClick = () => {
      this.onSelect({mode: 'bot'});
    }
  }

  destroy() {
    this.element.remove();
  }
}
