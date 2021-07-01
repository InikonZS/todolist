import {
  IChessData,
  ICellCoords,
  IChessLang,
  IChessView,
  ILangViewModal,
  ILangViewPlayer
} from 'utilities/interfaces';
import { Component } from 'utilities/Component';
import Timer from 'utilities/timer';
import configFigures, { chessConfigView, chessModeConfig, fen } from 'utilities/config-chess';
import Vector from 'utilities/vector';
import { IChessStart, IChessStop, IModalPopup } from '../../utilities/interfaces';

import ChessCell from './chess-cell';
import ChessButton from './chess-button';
import './chess-game.css';
import ChessHistoryBlock from './chess-history';
import ChessField from './chess-field';
import ModalDraw from './modal-draw';
import ChessModel from './chess-model';

class ChessGame extends Component {
  private cells: Array<ChessCell> = [];

  public onCellClick: (coords: ICellCoords) => void = () => {};

  timer: Timer;

  private history: ChessHistoryBlock;

  private playerOne: Component;

  private playerTwo: Component;

  private players: Array<string> = [];

  private isRotated = false;

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

  private host = '';

  private chessMode = '';

  private chessModalView: IModalPopup;

  chessBody: Component;

  parent: Component;

  constructor(
    parentNode: HTMLElement,
    langConfig: IChessLang,
    chessModel: ChessModel,
    chessMode: string,
    parentHeight: number,
    parent: Component
  ) {
    super(parentNode, 'div', [ chessConfigView.chessView.wrapper ]);
    this.parent = parent;
    this.element.classList.add('game_action_size');
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
      langConfig.history,
      parentHeight
    );

    this.chessBoard = new ChessField(
      this.chessBody.element,
      chessConfigView.figure,
      chessConfigView.boardView,
      chessConfigView.gameField,
      configFigures,
      parentHeight
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
      const parentHeight = Math.min(
        this.parent.element.clientWidth,
        this.parent.element.clientHeight - 140
      );
      this.chessBody.element.style.setProperty('--size', `${parentHeight}px`);
      this.chessBoard.changeHeight(parentHeight);
      this.history.changeHeight(parentHeight);
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

  clearData(fenField: string) {
    this.players = [];
    this.playerOne.element.textContent = this.langConfig.player1;
    this.playerTwo.element.textContent = this.langConfig.player2;
    // this.chessBoard.clearData();
    this.chessMode = '';
    this.timer.clear();
    this.destroy();
  }

  setPlayer(player: string, players: Array<string>): void {
    console.log(players);
    this.playerOne.element.textContent = players[0];
    this.players.push(players[0]);

    if (this.chessMode !== chessModeConfig.network) {
      this.host = players[0];
      this.btnStart.buttonEnable();
    } else if (players[1]) {
      this.playerTwo.element.textContent = players[1];
      this.players.push(players[1]);
      this.host = player !== players[0] ? players[0] : players[1];
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
    console.log(data.player, this.host);
    
    this.modalDraw = new ModalDraw(
      this.element,
      chessConfigView.modal,
      this.langConfigModals,
      data.stop,
      data.player,
      this.players,
      data.method
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
    const newField = fromFen(data.field);

    this.setHistoryMove(data.moves, data.figure);
    const oldFigPos = new Vector(data.coords[0].x, data.coords[0].y);
    const newFigPos = new Vector(data.coords[1].x, data.coords[1].y);

    this.setFigurePosition(oldFigPos, newFigPos);
    this.chessBoard.clearData(newField);

    this.updateGameField(data.rotate);
    this.removeAllowedMoves();
    this.chessBoard.showKingCheck(data.king);

    if (this.chessMode === chessModeConfig.network) {
      if (this.playerOne.element.textContent !== data.player) {
        this.playerOne.element.classList.add(this.chessView.activePlayer);
        this.playerTwo.element.classList.remove(this.chessView.activePlayer);
      } else {
        this.playerOne.element.classList.remove(this.chessView.activePlayer);
        this.playerTwo.element.classList.add(this.chessView.activePlayer);
      }
    }
  }

  createChessField(data: IChessStart) {
    this.chessBoard.setChessMode(this.chessMode);
    this.chessBoard.createFieldCells(fromFen(data.field));
    this.chessBoard.setDragable(true);
    this.timer.setTimer(data.time);
    this.btnDraw.buttonEnable();
    this.btnLoss.buttonEnable();
    this.btnStart.buttonDisable();
  }

  getPlayers(): Array<string> {
    return this.players;
  }
}

export default ChessGame;

function fromFen(fen: string): Array<string> {
  const fromFen: Array<string> = [];
  fen.split('/').join('').split('').forEach((el) => {
    if (!Number.isNaN(+el)) {
      for (let i = 0; i < +el; i++) {
        fromFen.push('-');
      }
    } else fromFen.push(el);
  });
  return fromFen.join('').split('').map((item) => (item === '-' ? '' : item));
}
