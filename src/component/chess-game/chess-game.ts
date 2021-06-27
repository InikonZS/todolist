import { IChessStart } from './../../utilities/interfaces';
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
import configFigures, { chessConfigView, fen } from 'utilities/config-chess';
import ModalDraw from './modal-draw';
import ModalLoss from './modal-loss';
import ChessModel from './chess-model';
import Timer from 'utilities/timer';
import { chessModeConfig } from '../chat/chatPage';

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
  private modalLoss: ModalLoss;
  public onModalLossClick: () => void = () => {};
  private model: ChessModel;
  private host: string = '';
  private chessMode: string = '';

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
    this.chessMode = chessMode;
    const chessControls = new Component(this.element, 'div', [ this.chessView.controls ]);
    const chessHead = new Component(this.element, 'div', [ this.chessView.head ]);
    this.playerOne = new Component(
      chessHead.element,
      'div',
      [ this.chessView.player ],
      this.langConfig.player1
    );
    this.timer = new Timer(chessHead.element);
    this.playerTwo = new Component(
      chessHead.element,
      'div',
      [ this.chessView.player ],
      this.langConfig.player2
    );
    const chessBody = new Component(this.element, 'div', [ this.chessView.body ]);
    this.history = new ChessHistoryBlock(
      chessBody.element,
      chessConfigView.history,
      langConfig.history
    );

    this.chessBoard = new ChessField(
      chessBody.element,
      chessConfigView.figure,
      chessConfigView.boardView,
      chessConfigView.gameField,
      configFigures,
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
    this.btnDraw.onClick = () => {
      this.model.chessStopGame('draw');
    };
    this.btnLoss = new ChessButton(
      chessControls.element,
      chessConfigView.btn,
      langConfig.controls.loss
    );
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
  }

  updateGameField(rotate: boolean): void {
    if (this.chessMode === chessModeConfig.single) {
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
      if (this.chessMode !== chessModeConfig.multy) {
        console.log('mode', this.chessMode);
        
        this.btnStart.buttonEnable();
      }
    } else if (this.players.length === 1) {
      this.playerTwo.element.textContent = player;
      this.players.push(player);
      this.btnStart.buttonEnable();
    }
  }

  setHistoryMove(coords: Array<ICellCoords>, figName: string): void {
    this.history.setHistoryMove(coords, this.timer.getTimeString(), figName);
  }

  setLangView(configLang: IChessLang): void {
    this.history.setLangView(configLang.history);
    this.langConfig = configLang.players;
    this.btnStart.setLangView(configLang.controls.start);
    this.btnDraw.setLangView(configLang.controls.draw);
    this.btnLoss.setLangView(configLang.controls.loss);
  }

  createModalDraw(status: string): void {
    this.modalDraw = new ModalDraw(
      this.element,
      chessConfigView.modal,
      this.langConfigModals,
      status,
      this.host,
      this.players
    );
    this.modalDraw.onModalDrawClick = () => {
      this.model.chessRemoveGame('remove');
    };
  }

  destroyModalDraw(): void {
    console.log('draw destroy');

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

    this.setHistoryMove(data.coords, data.figure);
    const oldFigPos = new Vector(data.coords[0].x, data.coords[0].y);
    const newFigPos = new Vector(data.coords[1].x, data.coords[1].y);

    this.setFigurePosition(oldFigPos, newFigPos);
    this.chessBoard.clearData(newField);

    this.updateGameField(data.rotate);
    this.removeAllowedMoves();
  }

  createChessField(data: IChessStart) {
    this.chessBoard.setChessMode(this.chessMode);
    this.chessBoard.createFieldCells(this.fromFen(data.field));
    this.chessBoard.setDragable(true);
    this.timer.setTimer(data.time);
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
}

export default ChessGame;
