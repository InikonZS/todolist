import Button from './button';
import { Component } from 'utilities/Component';

class SettingsItem extends Component {
  public onClick: (mode: string) => void = () => {};

  constructor(parentNode: HTMLElement, iconImg: string, mode: string) {
    super(parentNode, 'div', [ 'choice_wrapper' ]);
    const iconWrapper = new Component(this.element, 'div', [ 'choice_icon_wrapper' ]);
    const icon = new Component(iconWrapper.element, 'div', [ 'choice_icon' ]);
    icon.element.style.backgroundImage = `url(${iconImg})`;
    const button = new Button(this.element, 'settings_button', mode);
    button.onClick = () => {
      this.onClick(mode);
    };
  }
}

export default SettingsItem;
