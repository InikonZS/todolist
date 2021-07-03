import { Component } from 'utilities/Component';
import { IHeaderUser } from 'utilities/interfaces';
import { IHeaderControls } from '../../utilities/interfaces';

class HeaderAuth extends Component {
  private signIn: Component;

  private user: Component;

  private userAvatar: Component;

  private userName: Component;

  public onSignIn: () => void = () => {};

  public onUserClick: () => void = () => {};

  private configControls: IHeaderControls;

  constructor(parentNode: HTMLElement, configUser: IHeaderUser, configControls: IHeaderControls) {
    super(parentNode, 'div', [ configUser.wrapper ]);
    this.configControls = configControls;
    this.user = new Component(this.element, 'div', [ configUser.user ]);
    this.userAvatar = new Component(this.user.element, 'div', [ configUser.avatar ]);
    this.userAvatar.element.style.backgroundImage = `url(${configUser.defaultAvatar})`;
    this.userName = new Component(this.user.element, 'div', [ configUser.nickName ]);
    this.userName.element.textContent = 'NickName';

    this.signIn = new Component(this.element, 'div', [ configControls.wrapper ]);
    this.signIn.element.textContent = 'Sign In';
    this.signIn.element.onclick = () => {
      this.onSignIn();
    };

    this.user.element.onclick = () => {
      this.onUserClick();
    };
  }

  setAvatar(avatar: string): void {
    this.userAvatar.element.style.backgroundImage = `url(${avatar})`;
  }

  setUserName(name: string): void {
    this.userName.element.textContent = name;
  }

  hideElement(): void {
    this.signIn.element.classList.add(this.configControls.hidden);
  }

  showElement(): void {
    this.signIn.element.classList.remove(this.configControls.hidden);
  }
}

export default HeaderAuth;
