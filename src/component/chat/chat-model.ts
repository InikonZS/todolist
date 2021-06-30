import { IAuthData } from "src/authPage";
import ICrossData, { IChannelDTO, IuserChatMessage } from "utilities/interfaces";
import Signal from "utilities/signal";
import ChessModel from "../chess-game/chess-model";

class ChatModel {
  currentUser: IAuthData;

  public socket: WebSocket;

  userList: Array<string> = [];

  onMessage: Signal<IuserChatMessage> = new Signal();

  onCrossMove: Signal<ICrossData> = new Signal();

  onPlayerList: Signal<{ player: string; time: number; players: Array<string> }> = new Signal();

  onUserList: Signal<Array<string>> = new Signal();

  onChannelList: Signal<Array<IChannelDTO>> = new Signal();

  onRemoveChess: Signal<{ status: boolean, fen:string }> = new Signal();

  onClose : Signal<void> = new Signal();

  onOpen : Signal<void> = new Signal();

  chessModel: ChessModel;

  isConnected: boolean;

  open() {
    this.socket = new WebSocket('ws:/localhost:4080');
    this.chessModel = new ChessModel(this.socket);
    this.isConnected = false;
    this.socket.onopen = () => {
      console.log('onopen');

      this.joinUser();
      this.isConnected = true;
      this.onOpen.emit();
    };
    this.socket.onclose = () => {
      console.log('onclose');
      this.isConnected = false;
      this.onClose.emit();
    };
    this.socket.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      console.log(data);
      if (data.type === 'message') {
        this.onMessage.emit({
          avatar: '',
          userName: data.senderNick,
          time: new Date().toLocaleString('ru'),
          message: data.messageText,
        });
      }
      if (data.type === 'player') {
        this.onPlayerList.emit({ player: data.senderNick, time: data.time, players: data.players });
      }

      if (data.type === 'crossMove') {
        this.onCrossMove.emit({
          message: `${data.senderNick} -> ${data.messageText}`,
          coords: JSON.parse(data.messageText),
          player: data.senderNick,
          field: data.field,
          winner: data.winner,
          sign: data.sign,
        });
      }

      /* if (data.type = 'userLeave'){
        this.onMessage.emit(data.senderNick);
      }
      if (data.type = 'userJoin'){
        this.onMessage.emit(data.senderNick);
      } */
      if (data.type === 'userList') {
        this.onUserList.emit(data.userList);
      }

      if (data.type === 'channelList') {
        this.onChannelList.emit(data.channelList);
      }

      if (data.type === 'updateChannelList') {
        console.log('You must update view of channels');
      }

      if (data.type === 'chess-events') {
        if (data.method === 'removeGame') {
          this.onRemoveChess.emit({
            status: data.remove,
            fen: data.field,
          });
        }

        this.chessModel.processMessage(data);
      }
    };
  }

  sendMessage(message: string): void {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'sendMessage',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }

  joinUser(): void {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'joinUser',
        params: {
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }

  channelList(): void {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'channelList',
        params: {
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }

  joinChannel(name: string): void {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'joinChannel',
        params: {
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
          channelName: name,
        },
      }),
    );
  }

  joinPlayer(mode: string): void {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'joinPlayer',
        params: {
          mode,
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }

  crossMove(message: string): void {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'crossMove',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }

  setCurrentUser(user: IAuthData): void {
    this.currentUser = user;
  }

  leaveUser(): void {
    console.log(localStorage.getItem('todoListApplicationSessionId'));
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'leaveUser',
        params: {
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }

  addChannel(name: string): void {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'addChannel',
        params: {
          channelName: name,
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }

  close(): void {
    this.socket.close();
    this.isConnected = false;
  }
}

export default ChatModel;
