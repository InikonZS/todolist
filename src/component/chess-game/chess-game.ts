import { IChessStart, IChessStop, IModalPopup } from './../../utilities/interfaces';
import { IChessData } from 'utilities/interfaces';
import { Component } from 'utilities/Component';
import {
  ICellCoords,
  IChessLang,
  IChessView,
  ILangViewModal,
  ILangViewPlayer
} from 'utilities/interfaces';
import ChessCell from './chess-cell';
import ChessButton from './chess-button';
import './chess-game.css';
import ChessHistoryBlock from './chess-history';
import ChessField from './chess-field';
import Vector from 'utilities/vector';
import configFigures, { chessConfigView, chessModeConfig, fen } from 'utilities/config-chess';
import ModalDraw from './modal-draw';
import ChessModel from './chess-model';
import Timer from 'utilities/timer';

class ChessGame extends Component {
  private cells: Array<ChessCell> = [];
  public onCellClick: (coords: ICellCoords) => void = () => {};
  timer: Timer;
  private history: ChessHistoryBlock;
  private playerOne: Component;
  private playerTwo: Component;
  private players: Array<string> = [];
  private isRotated: boolean = false;
  private chessBoard: ChessField;
  private btnStart: ChessButton;
  public onStartClick: () => void = () => {};
  private btnDraw: ChessButton;
  public onDrawClick: () => void = () => {};
  private btnLoss: ChessButton;
  public onLossClick: () => void = () => {};
  public onFigureDrop: (posStart: Vector, posDrop: Vector) => void = () => {};
  public onFigureGrab: (pos: Vector) => void = () => {};
  private chessView: IChessView;
  private langConfig: ILangViewPlayer;
  private modalDraw: ModalDraw;
  private langConfigModals: ILangViewModal;
  public onModalDrawClick: () => void = () => {};
  public onModalLossClick: () => void = () => {};
  private model: ChessModel;
  private host: string = '';
  private chessMode: string = '';
  private chessModalView: IModalPopup;
  chessBody: Component;

  constructor(
    parentNode: HTMLElement,
    langConfig: IChessLang,
    chessModel: ChessModel,
    chessMode: string
  ) {
    super(parentNode, 'div', [ chessConfigView.chessView.wrapper ]);
    this.model = chessModel;
    this.langConfig = langConfig.players;
    this.langConfigModals = langConfig.modals;
    this.chessView = chessConfigView.chessView;
    this.chessModalView = chessConfigView.modal;
    this.chessMode = chessMode;
    const chessControls = new Component(this.element, 'div', [ this.chessView.controls ]);
    const chessHead = new Component(this.element, 'div', [ this.chessView.head ]);
    this.playerOne = new Component(
      chessHead.element,
      'div',
      [ this.chessView.player ],
      this.langConfig.player1
    );
    this.playerOne.element.classList.add(this.chessView.activePlayer);

    this.timer = new Timer(chessHead.element);
    this.playerTwo = new Component(
      chessHead.element,
      'div',
      [ this.chessView.player ],
      this.langConfig.player2
    );
    this.chessBody = new Component(this.element, 'div', [ this.chessView.body ]);
    this.history = new ChessHistoryBlock(
      this.chessBody.element,
      chessConfigView.history,
      langConfig.history
    );

    this.chessBoard = new ChessField(
      this.chessBody.element,
      chessConfigView.figure,
      chessConfigView.boardView,
      chessConfigView.gameField,
      configFigures
    );

    this.btnStart = new ChessButton(
      chessControls.element,
      chessConfigView.btn,
      langConfig.controls.start
    );
    this.btnStart.buttonDisable();
    this.btnStart.onClick = () => {
      this.model.chessStartGame(this.host);
      this.btnStart.buttonDisable();
    };
    this.btnDraw = new ChessButton(
      chessControls.element,
      chessConfigView.btn,
      langConfig.controls.draw
    );
    this.btnDraw.buttonDisable();
    this.btnDraw.onClick = () => {
      this.model.chessStopGame('draw');
    };
    this.btnLoss = new ChessButton(
      chessControls.element,
      chessConfigView.btn,
      langConfig.controls.loss
    );
    this.btnLoss.buttonDisable();
    this.btnLoss.onClick = () => {
      this.model.chessStopGame('loss');
    };

    this.chessBoard.onFigureDrop = (posStart: Vector, posDrop: Vector) => {
      this.model.chessMove(JSON.stringify([ posStart, posDrop ]));
    };

    this.chessBoard.onFigureGrab = (pos: Vector) => {
      this.model.chessFigureGrab(JSON.stringify(pos));
    };

    this.model.onChessMove.add((data) => this.onFigureMove(data));

    this.model.onStartGame.add((data) => this.createChessField(data));
    this.model.onStopGame.add((data) => this.createModalDraw(data));
    this.model.onChessFigureGrab.add((data) => this.showAllowedMoves(data));

    window.onresize = () => {
      this.chessBoard.element.style.setProperty(
        '--size',
        Math.min(this.chessBody.element.clientWidth, this.chessBody.element.clientHeight) + 'px'
      );
    };
  }

  updateGameField(rotate: boolean): void {
    if (this.chessMode === chessModeConfig.oneScreen) {
      if (rotate) {
        if (!this.isRotated) {
          this.chessBoard.element.classList.add('rotate');
        } else {
          this.chessBoard.element.classList.remove('rotate');
        }
        this.isRotated = !this.isRotated;
      }
    }
  }

  clearData(fen: string) {
    this.players = [];
    this.playerOne.element.textContent = this.langConfig.player1;
    this.playerTwo.element.textContent = this.langConfig.player2;
    this.chessBoard.clearData(this.fromFen(fen));
    this.chessMode = '';
    this.timer.clear();
    this.destroy();
  }

  setPlayer(player: string): void {
    if (!this.players.length) {
      this.playerOne.element.textContent = player;
      this.host = player;
      this.players.push(player);
      if (this.chessMode !== chessModeConfig.network) {
        this.btnStart.buttonEnable();
      }
    } else if (this.players.length === 1) {
      this.playerTwo.element.textContent = player;
      this.players.push(player);
      this.btnStart.buttonEnable();
    }
  }

  setHistoryMove(coords: Array<Array<Vector>>, figName: Array<string>): void {
    this.history.setHistoryMove(coords, this.timer.getTimeString(), figName);
  }

  setLangView(configLang: IChessLang): void {
    this.history.setLangView(configLang.history);
    this.langConfig = configLang.players;
    this.btnStart.setLangView(configLang.controls.start);
    this.btnDraw.setLangView(configLang.controls.draw);
    this.btnLoss.setLangView(configLang.controls.loss);
  }

  createModalDraw(data: IChessStop): void {
    this.modalDraw = new ModalDraw(
      this.element,
      chessConfigView.modal,
      this.langConfigModals,
      data.stop,
      data.player,
      this.players
    );
    this.modalDraw.onModalDrawClick = () => {
      this.model.chessRemoveGame('remove');
    };
  }

  destroyModalDraw(): void {
    this.modalDraw.destroy();
  }

  setFigurePosition(oldFigPos: Vector, newFigPos: Vector): void {
    this.chessBoard.setFigurePosition(oldFigPos, newFigPos);
  }

  showAllowedMoves(coords: Array<ICellCoords>): void {
    this.chessBoard.showAllowedMoves(coords);
  }

  removeAllowedMoves(): void {
    this.chessBoard.removeAlloweMoves();
  }

  onFigureMove(data: IChessData): void {
    this.host = data.player;
    const newField = this.fromFen(data.field);

    this.setHistoryMove(data.moves, data.figure);
    const oldFigPos = new Vector(data.coords[0].x, data.coords[0].y);
    const newFigPos = new Vector(data.coords[1].x, data.coords[1].y);

    this.setFigurePosition(oldFigPos, newFigPos);
    this.chessBoard.clearData(newField);

    this.updateGameField(data.rotate);
    this.removeAllowedMoves();
    this.chessBoard.showKingCheck(data.king);

    if (this.playerOne.element.textContent !== data.player) {
      this.playerOne.element.classList.add(this.chessView.activePlayer);
      this.playerTwo.element.classList.remove(this.chessView.activePlayer);
    } else {
      this.playerOne.element.classList.remove(this.chessView.activePlayer);
      this.playerTwo.element.classList.add(this.chessView.activePlayer);
    }
  }

  createChessField(data: IChessStart) {
    this.chessBoard.setChessMode(this.chessMode);
    this.chessBoard.createFieldCells(this.fromFen(data.field));
    this.chessBoard.setDragable(true);
    this.timer.setTimer(data.time);
    this.btnDraw.buttonEnable();
    this.btnLoss.buttonEnable();
    this.btnStart.buttonDisable();
  }

  fromFen(fen: string): Array<string> {
    let fromFen: Array<string> = [];
    fen.split('/').join('').split('').forEach((el) => {
      if (!isNaN(+el)) {
        for (let i = 0; i < +el; i++) {
          fromFen.push('-');
        }
      } else fromFen.push(el);
    });
    return fromFen.join('').split('').map((item) => (item === '-' ? '' : item));
  }

  getPlayers(): Array<string> {
    return this.players;
  }
}

export default ChessGame;
