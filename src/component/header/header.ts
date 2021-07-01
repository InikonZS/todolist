import { Component } from 'utilities/Component';
import configHeader from 'utilities/config-header';
import HeaderAuth from './header-auth';
import NavItem from './nav-item';

export class Navigation extends Component {
  private navContainer: Component;

  private navItems: Array<NavItem> = [];

  private userBlock: HeaderAuth;

  signIn: Component;

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', [configHeader.wrapper]);
    const logo = new Component(this.element, 'div', [configHeader.logo.logo]);
    logo.element.style.backgroundImage = `url(${configHeader.logo.image})`;
    this.navContainer = new Component(this.element, 'div', [configHeader.nav.container]);
    this.userBlock = new HeaderAuth(this.element, configHeader.user, configHeader.controls);

    this.userBlock.onSignIn = () => {
      console.log('Sign In');
    };

    this.userBlock.onUserClick = () => {
      console.log('User click');
    };
  }

  addLink(text: string, hash: string) {
    const navItem = new NavItem(this.navContainer.element, text, hash);
    this.navItems.push(navItem);
  }

  setActive(hash: string) {
    this.navItems.forEach((item) => {
      if (item.getHash() == hash) {
        item.setActive();
      } else {
        item.setInactive();
      }
    });
  }
}
