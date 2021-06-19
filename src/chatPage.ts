import { IAuthData } from './authPage';
import { Component } from './component/Component';
import { popupService } from './component/Popupservice';
import Cross, { ICellCoords } from './cross/cross';
import Signal from './signal';

interface IChannelDTO {
  name: string;
}
interface ICrossData {
  message: string;
  coords: ICellCoords;
  player: string;
  field: Array<string>;
  winner: string;
}

class ChatModel {
  currentUser: IAuthData;
  socket: WebSocket;
  userList: Array<string> = [];
  onMessage: Signal<string> = new Signal();
  onCrossMove: Signal<ICrossData> = new Signal();
  onPlayerList: Signal<{ player: string; players: Array<string> }> = new Signal();
  onUserList: Signal<Array<string>> = new Signal();
  onChannelList: Signal<Array<IChannelDTO>> = new Signal();
  constructor() {
    this.socket = new WebSocket('ws:/localhost:4080');
    this.socket.onopen = () => {
      this.joinUser();
    };

    this.socket.onmessage = (ev) => {
      let data = JSON.parse(ev.data);
      console.log(data);
      if (data.type === 'message') {
        this.onMessage.emit(data.senderNick + ' -> ' + data.messageText);
      }
      if (data.type === 'player') {
        this.onPlayerList.emit({ player: data.senderNick, players: data.players });
      }

      if (data.type === 'crossMove') {
        console.log('cross move');
        console.log(data);

        this.onCrossMove.emit({
          message: data.senderNick + ' -> ' + data.messageText,
          coords: JSON.parse(data.messageText),
          player: data.senderNick,
          field: data.field,
          winner: data.winner
        });
      }
      /*if (data.type = 'userLeave'){
        this.onMessage.emit(data.senderNick);
      }
      if (data.type = 'userJoin'){
        this.onMessage.emit(data.senderNick);
      }*/
      if (data.type === 'userList') {
        this.onUserList.emit(data.userList);
      }

      if (data.type === 'channelList') {
        this.onChannelList.emit(data.channelList);
      }
    };
  }

  sendMessage(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'sendMessage',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId')
        }
      })
    );
  }

  joinUser() {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'joinUser',
        params: {
          sessionId: localStorage.getItem('todoListApplicationSessionId')
        }
      })
    );
  }

  channelList() {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'channelList',
        params: {
          sessionId: localStorage.getItem('todoListApplicationSessionId')
        }
      })
    );
  }

  joinChannel(name: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'joinChannel',
        params: {
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
          channelName: name
        }
      })
    );
  }

  joinPlayer() {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'joinPlayer',
        params: {
          sessionId: localStorage.getItem('todoListApplicationSessionId')
        }
      })
    );
  }

  crossMove(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'crossMove',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId')
        }
      })
    );
  }

  setCurrentUser(user: IAuthData) {
    this.currentUser = user;
  }
}

export class Chat extends Component {
  messageContainer: Component;
  chatInput: Component;
  model: ChatModel = new ChatModel();
  userListContainer: Component;
  channelListContainer: Component;
  channels: Component[];
  cross: Cross;

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', [ 'main' ]);
    this.userListContainer = new Component(this.element);
    this.channelListContainer = new Component(this.element);
    this.messageContainer = new Component(this.element);
    this.chatInput = new Component(this.element, 'input');
    this.cross = new Cross(this.element);
    const btnEnter = new Component(this.element, 'button');
    btnEnter.element.textContent = 'ENTER THE GAME';
    btnEnter.element.onclick = () => {
      this.model.joinPlayer();
    };
    this.model.onPlayerList.add(({ player, players }) => {
      
    });

    this.cross.onCellClick = (coords: ICellCoords) => {
      this.model.crossMove(JSON.stringify(coords));
    };
    this.model.onCrossMove.add(({ message, coords, player, field, winner }) => {
      this.cross.updateGetGameField(field);
      if(winner) {
        console.log(`Winner: ${winner}`);
        this.cross.clearData();
      }
    });

    this.model.onMessage.add((message) => {
      let msg = new Component(this.messageContainer.element, 'div', [], message);
    });

    this.model.onUserList.add((userList) => {
      this.userListContainer.element.textContent = userList.join(', ');
    });

    this.model.onChannelList.add((channelList) => {
      this.channelListContainer.element.textContent = '';
      this.channels = channelList.map((channelData: IChannelDTO) => {
        const channel = new Component(this.channelListContainer.element, 'div');
        channel.element.textContent = channelData.name;
        channel.element.onclick = () => {
          this.model.joinChannel(channelData.name);
        };
        return channel;
      });
    });
    /*setTimeout(()=>{
        this.model.joinUser();
      }, 1000)*/

    this.chatInput.element.onkeyup = (e) => {
      if (e.key == 'Enter') {
        this.model.sendMessage((this.chatInput.element as HTMLInputElement).value);
        (this.chatInput.element as HTMLInputElement).value = '';
      }
    };
  }

  setCurrentUser(user: IAuthData) {
    this.model.setCurrentUser(user);
  }
}

export class RoomChat {
  constructor() {}
}
