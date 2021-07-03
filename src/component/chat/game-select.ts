import { Component } from 'utilities/Component';
import Button from './button';
import { GenericPopup } from './genericPopup';
import { gameIcons, gameSetPopup } from 'utilities/config-popup';
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
    const titleSelectGame = new Component(this.popupWrapper.element, 'div', ['title_game_select'], );
    titleSelectGame.element.textContent = 'Choose a game';

    this.wrapperButtons = new Component(this.popupWrapper.element, 'div', ['games']);

    gameSetPopup.forEach((game) => {
      const button = new Button(this.wrapperButtons.element, 'game_icon', '');
      button.element.style.backgroundImage = `url(${gameIcons.get(game)})`;
      button.onClick = () => {
        this.onSelect(game);
      };
    });
  }

  destroy() {
    this.element.remove();
  }
}
