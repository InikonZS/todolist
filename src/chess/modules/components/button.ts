import Control from './control';

class Button extends Control {
  public node: HTMLButtonElement;
  public onClick: () => void;

  constructor(parentNode: HTMLElement, caption: string) {
    super(parentNode, 'button', 'button', caption);
    this.node.classList.add(caption)
    this.node.onclick = () => {
      this.onClick && this.onClick();
    }
  }
  disable(){
    this.node.disabled = true;
  }
  enable(){
    this.node.disabled = false;
  }
}

export default Button;
