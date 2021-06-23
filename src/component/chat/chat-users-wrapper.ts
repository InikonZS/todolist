import { IChatUser, IChatUserWrapper, IUsersLang } from 'utilities/interfaces';
import { Component } from '../../utilities/Component';
import ChatUser from './chat-user';

class ChatUsersWrapper extends Component {
  private playersBlock: Component;
  private spectatorsBlock: Component;
  private spectators: Array<ChatUser> = [];
  private players: Array<ChatUser> = [];
  private userConfig: IChatUser;
  private spectatorHeader: Component;
  private playerHeader: any;

  constructor(parentNode: HTMLElement, configView: IChatUserWrapper, configLang: IUsersLang) {
    super(parentNode, 'div', [ configView.wrapper ]);
    this.userConfig = configView.user;
    this.playersBlock = new Component(this.element, 'div', [ configView.category ]);
    this.playerHeader = new Component(this.playersBlock.element, 'div', [
      configView.categoryName
    ]);
    this.playerHeader.element.textContent = configLang.players;

    this.spectatorsBlock = new Component(this.element, 'div', [ configView.category ]);
    this.spectatorHeader = new Component(this.spectatorsBlock.element, 'div', [
      configView.categoryName
    ]);
    this.spectatorHeader.element.textContent = configLang.spectators;
  }

  setPlayer(avatar: string, playerName: string): void {
    const chatPlayer = new ChatUser(this.playersBlock.element, avatar, playerName, this.userConfig);
    this.players.push(chatPlayer);
  }

  setSpectators(userList: Array<string>): void {
    this.spectators.forEach((user) => user.destroy());
    this.spectators = [];
    console.log(userList);

    this.spectators = userList.map((user) => {
      const chatUser = new ChatUser(this.spectatorsBlock.element, '', user, this.userConfig);
      return chatUser;
    });
  }

  deletePlayer(): void {
    this.players.forEach((player) => player.destroy());
    this.players = [];
  }

  setLangView(configLang: IUsersLang):void {
    this.playerHeader.element.textContent = configLang.players;
    this.spectatorHeader.element.textContent = configLang.spectators;
  }
}

export default ChatUsersWrapper;
