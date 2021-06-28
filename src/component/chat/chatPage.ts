import { IAuthData } from '../../authPage';
import { Component } from 'utilities/Component';
import { popupService } from '../Popupservice';
import Cross from '../../cross/cross';
import Signal from 'utilities/signal';
import ICrossData, {
  IChannelDTO,
  IuserChatMessage
} from 'utilities/interfaces';
import './chatPage.css';
import ChatChannelsWrapper from './chat-channels-wrapper';
import ChatUsersWrapper from './chat-users-wrapper';
import ChatInputWrapper from './chat-input-wrapper';
import ChatMessagesBlock from './chat-messages';
import ChessGame from '../chess-game/chess-game';
import { langConfigEn, langConfigRu } from 'utilities/lang-config';
import chatConfigView from 'utilities/config-chat';
import ChessModel from '../chess-game/chess-model';
import { popupService1 } from '../popupService/popupService1';
import { GameSelect } from './game-select';
import { GenericPopup } from './genericPopup';
import { ChessGameSettings } from './chess-game-settings';
import bgImage from '../../assets/logoChess.png';

let langConfig = langConfigEn;
// const chessMode = 'oneScreen';


class ChatModel {
  currentUser: IAuthData;
  public socket: WebSocket;
  userList: Array<string> = [];
  onMessage: Signal<IuserChatMessage> = new Signal();
  onCrossMove: Signal<ICrossData> = new Signal();
  onPlayerList: Signal<{ player: string; time: number }> = new Signal();
  onUserList: Signal<Array<string>> = new Signal();
  onChannelList: Signal<Array<IChannelDTO>> = new Signal();
  onRemoveChess: Signal<{status: boolean, fen:string}> = new Signal();
  onClose : Signal<void> = new Signal();
  onOpen : Signal<void> = new Signal();
  // onChessMove: Signal<IChessData> = new Signal();
  chessModel: ChessModel;
  isConnected: boolean;
  // open() {
  //   this.socket = new WebSocket('ws:/localhost:4080');

  // }

  open() {
    this.socket = new WebSocket('ws:/localhost:4080');
    this.chessModel = new ChessModel(this.socket);
    this.isConnected = false;
    this.socket.onopen = () => {
      console.log('onopen');
      
      this.joinUser();
      this.isConnected = true
      this.onOpen.emit();
    };
    this.socket.onclose = () => {
      console.log('onclose');
      this.isConnected = false;
      this.onClose.emit();
    }
    this.socket.onmessage = (ev) => {
      let data = JSON.parse(ev.data);
      console.log(data);
      if (data.type === 'message') {
        this.onMessage.emit({
          avatar: '',
          userName: data.senderNick,
          time: new Date().toLocaleString('ru'),
          message: data.messageText
        });
      }
      if (data.type === 'player') {
        this.onPlayerList.emit({ player: data.senderNick, time: data.time });
      }

      if (data.type === 'crossMove') {
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
      if (data.type === 'chess-events') {
        if (data.method === 'removeGame') {
          this.onRemoveChess.emit({
            status: data.remove,
            fen: data.field
          });
        }

        this.chessModel.processMessage(data);
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
    console.log('join User');
    
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

  joinPlayer(mode: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'joinPlayer',
        params: {
          mode: mode,
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
  leaveUser() {
    console.log(localStorage.getItem('todoListApplicationSessionId'))
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'leaveUser',
        params: {
          sessionId: localStorage.getItem('todoListApplicationSessionId')
        }
      })
    );
  }
  close(){
    this.socket.close();
    this.isConnected = false;
  }
}

export class Chat extends Component {
  messageContainer: Component;
  chatInput: Component;
  model: ChatModel = new ChatModel();
  userListContainer: Component;
  channelListContainer: Component;
  channels: Component[];
  gameInstance: Cross;
  chessGame: ChessGame;
  private channelBlock: ChatChannelsWrapper;
  private chatMain: Component;
  private chatUsers: ChatUsersWrapper;
  private chatAction: Component;
  private chessMode: string =  '';

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', [ chatConfigView.wrapper ]);
    this.channelBlock = new ChatChannelsWrapper(
      this.element,
      chatConfigView.channelWrapper,
      langConfig.chat.channels
    );
    this.chatMain = new Component(this.element, 'div', [ chatConfigView.main ]);
    this.chatAction = new Component(this.chatMain.element, 'div', [ chatConfigView.action ]);
    this.chatAction.element.style.backgroundImage = `url(${bgImage})`;
    const chatMessages = new ChatMessagesBlock(
      this.chatMain.element,
      chatConfigView.messageWrapper
    );
    const chatInputBlock = new ChatInputWrapper(
      this.chatMain.element,
      chatConfigView.inputWrapper,
      langConfig.chat.messages
    );
    this.chatUsers = new ChatUsersWrapper(
      this.element,
      chatConfigView.users,
      langConfig.chat.users
    );

    this.messageContainer = new Component(this.element);
    // this.gameInstance = new Cross(chatAction.element);

    const btnEnter = new Component(this.chatMain.element, 'button');
    btnEnter.element.textContent = 'ENTER THE GAME';
    btnEnter.element.onclick = () => {
      popupService1.showPopup<string>(GameSelect).then((result) => {
        console.log(result)
        if (result === 'chess') {
          popupService1.showPopup<{mode: string}>(ChessGameSettings).then((result) => {
            // this.chessMode = result.mode;
            console.log(result);
            this.chessGame = new ChessGame(this.chatAction.element, langConfig.chess, this.model.chessModel, result.mode);
            this.model.joinPlayer(result.mode);
          });
        }
      });

    };
    this.model.onPlayerList.add(({ player, time }) => {
      // this.gameInstance.setPlayer(player, time);
      this.chatUsers.setPlayer('', player);
      this.chessGame && this.chessGame.setPlayer(player);
    });

    // this.gameInstance.onCellClick = (coords: ICellCoords) => {
    //   this.model.crossMove(JSON.stringify(coords));
    // };
    // this.model.onCrossMove.add(({ message, coords, player, field, winner, sign }) => {
    //   this.gameInstance.updateGameField(field);
    //   this.gameInstance.setHistoryMove(sign, coords, '0:02');
    //   if (winner) {
    //     console.log(`Winner: ${winner}`);
    //     this.gameInstance.clearData();
    //     this.chatUsers.deletePlayer();
    //   }
    // });

    this.model.onMessage.add((message) => {
      chatMessages.addMessage(message);
      // let msg = new Component(this.messageContainer.element, 'div', [], message);
    });

    this.model.onUserList.add((userList) => {
      console.log(userList,'userlist')
      this.chatUsers.setSpectators(userList);
    });

    this.model.onChannelList.add((channelList) => {
      this.channelBlock.addChannels(channelList);
      this.channelBlock.onChannelClick = (channelName) => {
        console.log(channelName);
        this.model.joinChannel(channelName);
      };
      this.channelBlock.onAddBtnClick = () => {
        console.log('Add btn clicked');
      };
    });
    chatInputBlock.onClick = (message) => {
      this.model.sendMessage(message);
      chatInputBlock.clearInput();
    };
    chatInputBlock.onEnter = (message) => {
      this.model.sendMessage(message);
      chatInputBlock.clearInput();
    };
    // this.gameInstance.onStartClick = () => {
    //   console.log('Start click');
    // }
    // this.gameInstance.onDrawClick = () => {
    //   console.log('Draw click');
    // }
    // this.gameInstance.onLossClick = () => {
    //   console.log('Loss click');
    // }
    this.model.onRemoveChess.add(({status, fen}) => {
      if (status) {
        this.chatUsers.deletePlayer();
        this.chessGame && this.chessGame.clearData(fen);
        this.chessGame = null;
        // this.chessGame = new ChessGame(this.chatAction.element, langConfig.chess, this.model.chessModel, chessMode);
      }
    });
    this.model.onClose.add(()=>{
      this.chatUsers.setSpectators([])
    })
  }

  setCurrentUser(user: IAuthData) {
    this.model.setCurrentUser(user);
  }
  show() {
    console.log('show');
    
    super.show();
    if(!this.model.isConnected) {
      console.log('no connect');
      
      this.model.open();
      // this.model.joinUser();
    }
    if(this.model.isConnected) {
      console.log('connect');
      
      this.model.joinUser();
      // this.model.joinUser();
    }
    //this.model.leaveUser();

  }
  leave() {
    this.model.leaveUser();
    this.model.close();
  }
}

export class RoomChat {
  constructor() {}
}
