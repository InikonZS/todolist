import Button from "./button";
import { Component } from "utilities/Component";

export class SettingsItem extends Component {
  button:Button
  iconSettings: Component;
  constructor(parentNode: HTMLElement, styleWrapper:string = '',styleIcon:string = '', config: string = '', content:string = '') {
    super(parentNode, 'div', [styleWrapper]);
    this.iconSettings = new Component(this.element, 'div', [styleIcon]);
    this.button = new Button(this.element, config, content);
  }
}
