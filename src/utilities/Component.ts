export class Component {
  element: HTMLElement;

  constructor(
    parentNode: HTMLElement | null = null,
    tag: keyof HTMLElementTagNameMap = 'div',
    styles: string[] = [],
    content = '',
  ) {
    this.element = document.createElement(tag);
    this.element.classList.add(...styles);
    this.element.innerHTML = `${content}`;

    if (parentNode) {
      parentNode.appendChild(this.element);
    }
  }

  destroy() {
    this.element.remove();
  }

  show() {
    this.element.style.display = '';
  }

  hide() {
    this.element.style.display = 'none';
  }
}
