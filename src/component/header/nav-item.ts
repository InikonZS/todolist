import { Component } from '../../utilities/Component';

class NavItem extends Component {
  private link: HTMLAnchorElement;

  private hash: string;

  constructor(parentNode: HTMLElement, text: string, hash: string) {
    super(parentNode, 'div', ['nav_item']);
    this.hash = hash;
    const link = new Component(this.element, 'a', ['nav_link']);
    const linkElement = link.element as HTMLAnchorElement;
    linkElement.href = `#${hash}`;
    linkElement.textContent = text;

    this.link = linkElement;
  }

  getHash() {
    return this.hash;
  }

  setActive() {
    this.link.classList.add('nav_link__active');
  }

  setInactive() {
    this.link.classList.remove('nav_link__active');
  }
}

export default NavItem;
