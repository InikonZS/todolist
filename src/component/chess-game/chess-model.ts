import { IChessData, ICellCoords } from 'utilities/interfaces';
import Signal from 'utilities/signal';

class ChessModel {
  onChessMove: Signal<IChessData> = new Signal();
  socket: WebSocket;
  onStartGame: Signal<string> = new Signal();
  onStopGame: Signal<boolean> = new Signal();
  onRemoveGame: Signal<boolean> = new Signal();
  onChessFigureGrab: Signal<Array<ICellCoords>> = new Signal();
  constructor(socket: WebSocket) {
    this.socket = socket;
  }

  processMessage(data: any) {
    if (data.method === 'chessMove') {
      this.onChessMove.emit({
        message: data.senderNick + ' -> ' + data.messageText,
        coords: JSON.parse(data.messageText),
        player: data.senderNick,
        field: data.field,
        winner: data.winner,
        sign: data.sign
      });
    }
    if (data.method === 'startGame') {
      console.log(data.field);
      
      this.onStartGame.emit(data.field);
    }

    if (data.method === 'chessFigureGrab') {
      this.onChessFigureGrab.emit(data.moves);
    }
    if (data.method === 'stopGame') {
      this.onStopGame.emit(data.stop);
    }

    if (data.method === 'removeGame') {
      this.onRemoveGame.emit(data.remove);
    }
  }

  chessMove(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessMove',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId')
        }
      })
    );
  }

  chessFigureGrab(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessFigureGrab',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId')
        }
      })
    );
  }

  chessStartGame(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessStartGame',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId')
        }
      })
    );
  }
  chessStopGame(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessStopGame',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId')
        }
      })
    );
  }
  chessRemoveGame(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessRemoveGame',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId')
        }
      })
    );
  }
}

export default ChessModel;
