import { Component } from 'utilities/Component';
import Button from './button';
import { GenericPopup } from './genericPopup';
import iconChessImg from '../../assets/chess.png';
import iconCrossImg from '../../assets/cross.png';
export class GameSelect extends GenericPopup<string> {
  buttonChess: Button;

  buttonCross:Button;

  // popupLayer: Component;
  // popupBlackout: Component;
  popupWrapper: Component;

  wrapperButtons:Component;

  // onSelect: (value: string) => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    // super(parentNode, 'div', ['popup_blackout']);
    // this.popupLayer = new Component(this.element, 'div',['popup_layer']);
    // this.popupBlackout = new Component(this.popupLayer.element, 'div',['popup_blackout']);
    // this.popupWrapper = new Component(this.element, 'div',['popup_wrapper']);
    const titleSelectGame = new Component(this.popupWrapper.element, 'div', ['title_game_select'], 'Choose a game');
    this.wrapperButtons = new Component(this.popupWrapper.element, 'div', ['games']);
    this.buttonChess = new Button(this.wrapperButtons.element, 'chess-wrap', '');
    this.buttonCross = new Button(this.wrapperButtons.element, 'cross-wrap', '');
    const iconChess = new Component(this.buttonChess.element, 'img', ['chess']);
    const iconCross = new Component(this.buttonCross.element, 'img', ['cross']);
    iconChess.element.setAttribute('src', iconChessImg);
    iconCross.element.setAttribute('src', iconCrossImg);

    this.buttonChess.onClick = () => {
      this.onSelect('chess');
    };

    this.buttonCross.onClick = () => {
      this.onSelect('cross');
    };
  }

  destroy() {
    this.element.remove();
  }
}
