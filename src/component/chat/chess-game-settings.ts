import { Component } from 'utilities/Component';
import { chessSettingIcons, gameModePopup } from 'utilities/config-popup';
import Button from './button';
import { GenericPopup } from './genericPopup';
import SettingsItem from './settings-item';

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
    const titleSettingsChess = new Component(this.popupWrapper.element, 'div', ['title_settings-chess']);
    titleSettingsChess.element.textContent = 'Choose a game type';

    const settingsWrapper = new Component(this.popupWrapper.element, 'div', ['game_settings_popup']);
    gameModePopup.forEach((mode) => {
      const modeChoice = new SettingsItem(settingsWrapper.element, chessSettingIcons.get(mode), mode);
      modeChoice.onClick = (mode) => {
        this.onSelect({ mode: mode });
      }
    })
  }

  destroy() {
    this.element.remove();
  }
}
