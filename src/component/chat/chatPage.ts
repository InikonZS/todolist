import { IAuthData } from '../../authPage';
import { Component } from '../../utilities/Component';
import { popupService } from '../Popupservice';
import Cross from '../../cross/cross';
import Signal from '../../utilities/signal';
import ICrossData, { ICellCoords, IChannelDTO, IuserChatMessage } from '../../utilities/interfaces';
import './chatPage.css';
import ChatChannel from './chat-chanel';
import ChatChannelsWrapper from './chat-channels-wrapper';
import ChatUsersWrapper from './chat-users-wrapper';
import ChatInputWrapper from './chat-input-wrapper';
import ChatMessagesBlock from './chat-messages';



class ChatModel {
  currentUser: IAuthData;
  socket: WebSocket;
  userList: Array<string> = [];
  onMessage: Signal<IuserChatMessage> = new Signal();
  onCrossMove: Signal<ICrossData> = new Signal();
  onPlayerList: Signal<{ player: string; time: number }> = new Signal();
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
          avatar: '',
          userName: data.senderNick,
          time: new Date().toLocaleString('ru'),
          message: data.messageText});
      }
      if (data.type === 'player') {
        this.onPlayerList.emit({ player: data.senderNick, time: data.time });
      }

      if (data.type === 'crossMove') {
        console.log('cross move');
        console.log(data);

        this.onCrossMove.emit({
          message: data.senderNick + ' -> ' + data.messageText,
          coords: JSON.parse(data.messageText),
          player: data.senderNick,
          field: data.field,
          winner: data.winner,
          sign: data.sign
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
  private channelBlock: ChatChannelsWrapper;
  private chatMain: Component;
  private chatUsers: ChatUsersWrapper;

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', [ 'chat_wrapper' ]);
    this.channelBlock = new ChatChannelsWrapper(this.element)
    this.chatMain = new Component(this.element, 'div', ['chat_main']);
    const chatAction = new Component(this.chatMain.element, 'div', ['chat_action']);
    const chatMessages = new ChatMessagesBlock(this.chatMain.element);
    const chatInputBlock = new ChatInputWrapper(this.chatMain.element);
    this.chatUsers = new ChatUsersWrapper(this.element);

    this.messageContainer = new Component(this.element);
    // this.chatInput = new Component(this.element, 'input');
    this.cross = new Cross(chatAction.element);
    const btnEnter = new Component(this.chatMain.element, 'button');
    btnEnter.element.textContent = 'ENTER THE GAME';
    btnEnter.element.onclick = () => {
      this.model.joinPlayer();
    };
    this.model.onPlayerList.add(({ player, time }) => {
      this.cross.setPlayer(player, time);
      this.chatUsers.setPlayer('', player);
    });

    this.cross.onCellClick = (coords: ICellCoords) => {
      this.model.crossMove(JSON.stringify(coords));
    };
    this.model.onCrossMove.add(({ message, coords, player, field, winner, sign }) => {
      this.cross.updateGameField(field);
      this.cross.setHistoryMove(sign, coords, '0:02');
      if (winner) {
        console.log(`Winner: ${winner}`);
        this.cross.clearData();
        this.chatUsers.deletePlayer();
      }
    });

    this.model.onMessage.add((message) => {
      chatMessages.addMessage(message);
      // let msg = new Component(this.messageContainer.element, 'div', [], message);
    });

    this.model.onUserList.add((userList) => {
      this.chatUsers.setSpectators(userList)
    });

    this.model.onChannelList.add((channelList) => {
      this.channelBlock.addChannels(channelList);
      this.channelBlock.onChannelClick = (channelName) => {
        console.log(channelName);
        this.model.joinChannel(channelName);
      }
      this.channelBlock.onAddBtnClick = () => {
        console.log('Add btn clicked');
        
      }

      // this.channelListContainer.element.textContent = '';

      // this.channels = channelList.map((channelData: IChannelDTO) => {
      //   const channel = new ChatChannel(this.channelListContainer.element);
      //   channel.element.textContent = channelData.name;
      //   channel.onClick = () => {
      //     this.model.joinChannel(channelData.name);
      //   };
      //   return channel;
      // });
    });
    /*setTimeout(()=>{
        this.model.joinUser();
      }, 1000)*/

    // this.chatInput.element.onkeyup = (e) => {
    //   if (e.key == 'Enter') {
    //     this.model.sendMessage((this.chatInput.element as HTMLInputElement).value);
    //     (this.chatInput.element as HTMLInputElement).value = '';
    //   }
    // };

    chatInputBlock.onClick = (message) => {
      this.model.sendMessage(message);
      chatInputBlock.clearInput();
    }
    chatInputBlock.onEnter = (message) => {
      this.model.sendMessage(message);
      chatInputBlock.clearInput();
    }
  }

  setCurrentUser(user: IAuthData) {
    this.model.setCurrentUser(user);
  }
}

export class RoomChat {
  constructor() {}
}
