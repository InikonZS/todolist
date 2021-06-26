
import { ICellCoords } from './../todolist/src/cross/cross';
import { IAuthData } from './authPage';
import { Component } from './component/Component';
import { popupService } from './component/Popupservice';
import Cross  from './cross/cross';
import Signal from './signal';

interface IChannelDTO {
  name: string;
}

class ChatModel {
  currentUser: IAuthData;
  socket: WebSocket;
  userList: Array<string> = [];
  onMessage: Signal<{ message: string; coords: ICellCoords; player: string }> = new Signal();
  onRename : Signal<{message: string, user : string}> = new Signal();
  onPlayerList: Signal<string> = new Signal();
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
        this.onMessage.emit({
          message: data.senderNick + ' -> ' + data.messageText,
          coords: JSON.parse(data.messageText),
          player: data.senderNick
        });
      }
      if (data.type === 'renameUser') {
        this.onRename.emit({
          message: data.senderNick + ' chaneged name for ' + data.messageText,
          user: data.messageText
        });
      }
      if (data.type === 'player') {
        console.log('player click');

        this.onPlayerList.emit(data.senderNick);
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
  renameUser(newName: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'renameUser',
        params: {
          messageText: newName,
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
    this.model.onPlayerList.add((player) => {
      const players = this.cross.getPlayers();
      if (this.cross.getPlayers().length < 2) {
        this.cross.setPlayers(player);
        console.log(player);
        console.log(players);
      }
      if (this.cross.getPlayers().length === 2){
        this.cross.startTimerCountDown();
      }
    });

    this.cross.onCellClick = (coords: ICellCoords) => {
      this.model.sendMessage(JSON.stringify(coords));
    };
    this.model.onMessage.add(({ message, coords, player }) => {
      console.log(message, coords);
      const gamePlayer = this.cross.getCurrentPlayer();
      if (player === gamePlayer) {
        this.cross.blockCell(coords, player);
      }
      let msg = new Component(this.messageContainer.element, 'div', [], message);
    });
    // document.onclick = () =>{
    //   //this.model.renameUser('Killer228')
    //   //TODO Взять из инпута имя и сделать кнопку
    // }
    this.model.onRename.add(({message,user})=>{
      console.log(message);
    })

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
