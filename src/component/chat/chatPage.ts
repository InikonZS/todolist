import { Component } from 'utilities/Component';
import Signal from 'utilities/signal';
import ICrossData, {
  IChannelDTO,
  IuserChatMessage,
} from 'utilities/interfaces';
import { langConfigEn, langConfigRu } from 'utilities/lang-config';
import chatConfigView from 'utilities/config-chat';
import { apiRequest } from 'utilities/utils';
import { IAuthData } from '../../authPage';
import { popupService } from '../Popupservice';
import Cross from '../../cross/cross';
import './chatPage.css';
import ChatChannelsWrapper from './chat-channels-wrapper';
import ChatUsersWrapper from './chat-users-wrapper';
import ChatInputWrapper from './chat-input-wrapper';
import ChatMessagesBlock from './chat-messages';
import ChessGame from '../chess-game/chess-game';
import ChessModel from '../chess-game/chess-model';
import { popupService1 } from '../popupService/popupService1';
import { GameSelect } from './game-select';
import { GenericPopup } from './genericPopup';
import { ChessGameSettings } from './chess-game-settings';
import bgImage from '../../assets/bg-chess.png';
import ChatModel from './chat-model';

const langConfig = langConfigEn;
// const chessMode = 'oneScreen';

export interface IChannelData{
  name:string;
  msgArr:Array<string>;
}

const apiUrl = 'http://localhost:4040/authService/';

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

  private chessMode = '';

  btnEnter: Component;

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', [chatConfigView.wrapper]);
    this.channelBlock = new ChatChannelsWrapper(
      this.element,
      chatConfigView.channelWrapper,
      langConfig.chat.channels,
    );
    this.chatMain = new Component(this.element, 'div', [chatConfigView.main]);
    this.chatAction = new Component(this.chatMain.element, 'div', [chatConfigView.action]);
    this.chatAction.element.style.backgroundImage = `url(${bgImage})`;
    const chatMessages = new ChatMessagesBlock(
      this.chatMain.element,
      chatConfigView.messageWrapper,
    );
    const chatInputBlock = new ChatInputWrapper(
      this.chatMain.element,
      chatConfigView.inputWrapper,
      langConfig.chat.messages,
    );
    this.chatUsers = new ChatUsersWrapper(
      this.element,
      chatConfigView.users,
      langConfig.chat.users,
    );

    this.messageContainer = new Component(this.element);
    // this.gameInstance = new Cross(chatAction.element);
    this.createBtnEnter();

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
      console.log(userList, 'userlist');
      this.chatUsers.setSpectators(userList);
    });

    this.model.onChannelList.add((channelList) => {
      this.channelBlock.addChannels(channelList);
      this.channelBlock.onChannelClick = (channelName) => {
        console.log(channelName);
        this.model.joinChannel(channelName);
      };
      this.channelBlock.onAddBtnClick = () => {
        const nameChannel = prompt('Enter channel name');
        this.model.addChannel(nameChannel);
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
    this.model.onRemoveChess.add(({ status, fen }) => {
      if (status) {
        this.chatUsers.deletePlayer();
        this.chessGame && this.chessGame.clearData(fen);
        this.chessGame = null;
        this.createBtnEnter();
        // this.chessGame = new ChessGame(this.chatAction.element, langConfig.chess, this.model.chessModel, chessMode);
      }
    });
    this.model.onClose.add(() => {
      this.chatUsers.setSpectators([]);
    });
  }

  setCurrentUser(user: IAuthData) {
    this.model.setCurrentUser(user);
  }

  show() {
    console.log('show');

    super.show();
    if (!this.model.isConnected) {
      console.log('no connect');

      this.model.open();
      // this.model.joinUser();
    }
    if (this.model.isConnected) {
      console.log('connect');

      this.model.joinUser();
      // this.model.joinUser();
    }
    // this.model.leaveUser();
  }

  leave() {
    this.model.leaveUser();
    this.model.close();
  }

  async addChannel(channelData:IChannelData) {
    const request = apiRequest(apiUrl, 'addchannel', channelData).then((res) => {
    });
    return request;
  }

  createBtnEnter() {
    this.chatAction.element.classList.add('relative_pos');
    this.btnEnter = new Component(this.chatAction.element, 'button', ['btn_enter']);
    this.btnEnter.element.textContent = 'ENTER THE GAME';
    this.btnEnter.element.onclick = () => {
      this.destroyBtnEnter();
      this.chatAction.element.classList.remove('relative_pos');
      popupService1.showPopup<string>(GameSelect).then((result) => {
        console.log(result);
        if (result === 'chess') {
          popupService1.showPopup<{ mode: string }>(ChessGameSettings).then((result) => {
            // this.chessMode = result.mode;
            console.log(result);
            this.chessGame = new ChessGame(this.chatAction.element, langConfig.chess, this.model.chessModel, result.mode);
            this.model.joinPlayer(result.mode);
          });
        }
      });
    };
  }

  destroyBtnEnter() {
    this.btnEnter.destroy();
  }
}

export class RoomChat {
  constructor() {}
}
