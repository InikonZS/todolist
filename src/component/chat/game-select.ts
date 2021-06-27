import Button from "./button";
import { Component } from "utilities/Component";
import { GenericPopup } from "./genericPopup";

export class GameSelect extends GenericPopup<string> {
  buttonChess: Button;
  buttonCross:Button;
  // popupLayer: Component;
  // popupBlackout: Component;
  popupWrapper: Component;

  // onSelect: (value: string) => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode)
    // super(parentNode, 'div', ['popup_blackout']);
    // this.popupLayer = new Component(this.element, 'div',['popup_layer']);
    // this.popupBlackout = new Component(this.popupLayer.element, 'div',['popup_blackout']);
    // this.popupWrapper = new Component(this.element, 'div',['popup_wrapper']);

    this.buttonChess = new Button(this.popupWrapper.element, 'popup_default_button', 'Chess Game');
    this.buttonCross = new Button(this.popupWrapper.element, 'popup_default_button', 'Cross Game');

    this.buttonChess.onClick = () => {
      this.onSelect('chess');
    }

    this.buttonCross.onClick = () => {
      this.onSelect('cross');
    }
  }

  destroy() {
    this.element.remove();
  }
}
