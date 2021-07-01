import { Component } from 'utilities/Component';
import Button from './button';
import { GenericPopup } from './genericPopup';
import { SettingsItem } from './settings-item';

export class ChessGameSettings extends GenericPopup<{ mode: string }> {
  // popupLayer: Component;
  // popupBlackout: Component;
  // popupWrapper: Component;

  // onSelect: (value: {mode: string}) => void;

  buttonOneScreen: Button;

  buttonNetwork: Button;

  buttonBot: Button;

  wrapperOneScreen: SettingsItem;

  wrapperNetwork: SettingsItem;

  wrapperBot: SettingsItem;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    // super(parentNode, 'div', ['popup_blackout']);

    // this.popupWrapper = new Component(this.element, 'div',['popup_wrapper']);
    const titleSettingsChess = new Component(this.popupWrapper.element, 'div', ['title_settings-chess'] , 'Choose a game type');
    this.wrapperOneScreen = new SettingsItem(this.popupWrapper.element, 'one_screen', 'one_screen-icon', 'settings_button', 'One Screen');
    this.wrapperNetwork = new SettingsItem(this.popupWrapper.element, 'network', 'network-icon', 'settings_button', 'Network');
    this.wrapperBot = new SettingsItem(this.popupWrapper.element, 'bot', 'bot-icon', 'settings_button', 'Bot');
    this.popupWrapper.element.classList.add('game-settings-popup');

    // this.buttonOneScreen = new Button(this.popupWrapper.element, 'popup_default_button', 'One Screen');
    // this.buttonNetwork = new Button(this.popupWrapper.element, 'popup_default_button', 'Network');
    // this.buttonBot = new Button(this.popupWrapper.element, 'popup_default_button', 'Bot');

    // this.buttonOneScreen.onClick = () => {
    //   this.onSelect({ mode: 'oneScreen' });
    // };

    // this.buttonNetwork.onClick = () => {
    //   this.onSelect({ mode: 'network' });
    // };

    // this.buttonBot.onClick = () => {
    //   this.onSelect({ mode: 'bot' });
    // };
    this.wrapperOneScreen.button.onClick = () => {
      this.onSelect({ mode: 'oneScreen' });
    };

    this.wrapperNetwork.button.onClick = () => {
      this.onSelect({ mode: 'network' });
    };

    this.wrapperBot.button.onClick = () => {
      this.onSelect({ mode: 'bot' });
    };
  }

  destroy() {
    this.element.remove();
  }
}
