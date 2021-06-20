import { Component } from "./utilities/Component";

class NavItem extends Component {
  private link: HTMLAnchorElement;
  private hash:string;
  constructor (parentNode:HTMLElement, text:string, hash:string){
    super(parentNode, 'div', ['nav_item']);
    this.hash = hash;
    let link = new Component(this.element, 'a', ['nav_link']);
    let linkElement = link.element as HTMLAnchorElement;
    linkElement.href = '#' + hash;
    linkElement.textContent = text;

    this.link = linkElement;
  }

  getHash(){
    return this.hash;
  }

  setActive(){
    this.link.classList.add('nav_link__active');
  }

  setInactive(){
    this.link.classList.remove('nav_link__active');
  }
}

export class Navigation extends Component {
  private navContainer:HTMLElement;
  private navItems:Array<NavItem> = [];
  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', ["header_wrapper"],
      `
        <div class="header_logo">Logo</div>
        <div class="header_nav">
        </div>

        <div class="header_auth">
          <div class="auth_user">
            <div class="auth_avatar"></div>
            <div class="auth_nickname"> Nick Name</div>
          </div>
          <div class="auth_controls">
            <div class="auth_button">sign in</div>
            <div class="auth_button">registry</div>
          </div>
        </div>
      `);
    var navContainer = this.element.querySelector<HTMLElement>('.header_nav');
    if (navContainer !== null){
      this.navContainer = navContainer;
    } else {
      throw new Error('Element not found');
    }
  }

  addLink(text: string, hash: string) {
    let navItem = new NavItem(this.navContainer, text, hash);
    this.navItems.push(navItem);
  }

  setActive(hash:string){
    this.navItems.forEach(item=>{
      if (item.getHash() == hash){
        item.setActive();
      } else {
        item.setInactive();
      }
    })
  }
}