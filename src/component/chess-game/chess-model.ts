import {
  IChessData, ICellCoords, IChessStart, IChessStop,
} from 'utilities/interfaces';
import Signal from 'utilities/signal';

class ChessModel {
  onChessMove: Signal<IChessData> = new Signal();

  socket: WebSocket;

  onStartGame: Signal<IChessStart> = new Signal();

  onStopGame: Signal<IChessStop> = new Signal();

  onRemoveGame: Signal<boolean> = new Signal();

  onChessFigureGrab: Signal<Array<ICellCoords>> = new Signal();

  constructor(socket: WebSocket) {
    this.socket = socket;
  }

  processMessage(data: any) {
    if (data.method === 'chessMove') {
      // !!!-----------change to History
      const dataFigure = new Array<string>();
      const dataMoves = new Array();
      for (let i = 0; i < data.history.length; i++) {
        dataFigure.push(data.history[i].figure);
        const move = [];
        move.push(data.history[i].startCell);
        move.push(data.history[i].endCell);
        dataMoves.push(move);
        //data.time temporaly ignored
      }
      // !!!-----------end change
      this.onChessMove.emit({
        message: `${data.senderNick} -> ${data.messageText}`,
        coords: JSON.parse(data.messageText),
        player: data.senderNick,
        field: data.field,
        winner: data.winner,
        rotate: data.rotate,
        figure: dataFigure,
        moves: dataMoves,
        king: data.king,
      });
    }
    if (data.method === 'startGame') {
      this.onStartGame.emit({ field: data.field, time: data.time });
    }

    if (data.method === 'chessFigureGrab') {
      this.onChessFigureGrab.emit(data.moves);
    }
    if (data.method === 'stopGame') {
      this.onStopGame.emit({ stop: data.stop, player: data.player });
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
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }

  chessFigureGrab(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessFigureGrab',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }

  chessStartGame(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessStartGame',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }

  chessStopGame(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessStopGame',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }

  chessRemoveGame(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessRemoveGame',
        params: {
          messageText: message,
          sessionId: localStorage.getItem('todoListApplicationSessionId'),
        },
      }),
    );
  }
}

export default ChessModel;
