class Control {
  public node: HTMLElement;

  constructor(parentNode: HTMLElement | null, tagName: string = 'div', className: string = '', content: string = '') {
    const el = document.createElement(tagName);
    el.className = className;
    el.textContent = content;
    if (parentNode){
      parentNode.append(el);
    }
    this.node = el;
  }
}

export default Control;
