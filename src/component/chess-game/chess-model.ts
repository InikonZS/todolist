import { IChessData } from "utilities/interfaces";
import Signal from "utilities/signal";

class ChessModel {
  onChessMove: Signal<IChessData> = new Signal();
  socket: WebSocket
  onStartGame: Signal<boolean> = new Signal();
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
      this.onStartGame.emit(data.start);
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
}

export default ChessModel;
