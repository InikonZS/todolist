import { Component } from '../../utilities/Component';
import ChatUser from './chat-user';

class ChatUsersWrapper extends Component {
  private playersBlock: Component;
  private spectatorsBlock: Component;
  private spectators: Array<ChatUser> = [];
  private players: Array<ChatUser> = [];

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'chat_users' ]);
    this.playersBlock = new Component(this.element, 'div', [ 'chat_category' ]);
    const playerHeader = new Component(this.playersBlock.element, 'div', [ 'chat_category_name' ]);
    playerHeader.element.textContent = 'Players:';

    this.spectatorsBlock = new Component(this.element, 'div', [ 'chat_category' ]);
    const spectatorHeader = new Component(this.spectatorsBlock.element, 'div', [
      'chat_category_name'
    ]);
    spectatorHeader.element.textContent = 'Spectators:';
  }

  setPlayer(avatar: string, playerName: string): void {
    const chatPlayer = new ChatUser(this.playersBlock.element, avatar, playerName);
    this.players.push(chatPlayer);
  }

  setSpectators(userList: Array<string>): void {
    this.spectators.forEach((user) => user.destroy());
    this.spectators = [];
    console.log(userList);
    

    this.spectators = userList.map((user) => {
      const chatUser = new ChatUser(this.spectatorsBlock.element, '', user);
      return chatUser;
    });
  }

  deletePlayer(): void {
    this.players.forEach((player) => player.destroy());
    this.players = [];
  }
}

export default ChatUsersWrapper;
