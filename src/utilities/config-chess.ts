import blackRook from '../assets/blackRook.svg';
import blackBishop from '../assets/blackBishop.svg';
import blackKnight from '../assets/blackKnight.svg';
import blackKing from '../assets/blackKing.svg';
import blackQueen from '../assets/blackQueen.svg';
import blackPawn from '../assets/blackPawn.svg';
import whiteRook from '../assets/whiteRook.svg';
import whiteBishop from '../assets/whiteBishop.svg';
import whiteKnight from '../assets/whiteKnight.svg';
import whiteKing from '../assets/whiteKing.svg';
import whiteQueen from '../assets/whiteQueen.svg';
import whitePawn from '../assets/whitePawn.svg';

// export const configFigures = {
//   r: blackRook,
//   n: blackKnight,
//   b: blackBishop,
//   q: blackQueen,
//   k: blackKing,
//   p: blackPawn,
//   R: whiteRook,
//   N: whiteKnight,
//   B: whiteBishop,
//   Q: whiteQueen,
//   K: whiteKing,
//   P: whitePawn
// };

export const configFigures = new Map<string, string>([
  [ 'r', blackRook ],
  [ 'n', blackKnight ],
  [ 'b', blackBishop ],
  [ 'b', blackBishop ],
  [ 'q', blackQueen ],
  [ 'k', blackKing ],
  [ 'p', blackPawn ],
  [ 'R', whiteRook ],
  [ 'N', whiteKnight ],
  [ 'B', whiteBishop ],
  [ 'Q', whiteQueen ],
  [ 'K', whiteKing ],
  [ 'P', whitePawn ]
]);

export const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

// const configField = [
//   configFigures.r,
//   configFigures.n,
//   configFigures.b,
//   configFigures.q,
//   configFigures.k,
//   configFigures.b,
//   configFigures.n,
//   configFigures.r,
//   configFigures.p,
//   configFigures.p,
//   configFigures.p,
//   configFigures.p,
//   configFigures.p,
//   configFigures.p,
//   configFigures.p,
//   configFigures.p,
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   configFigures.P,
//   configFigures.P,
//   configFigures.P,
//   configFigures.P,
//   configFigures.P,
//   configFigures.P,
//   configFigures.P,
//   configFigures.P,
//   configFigures.R,
//   configFigures.N,
//   configFigures.B,
//   configFigures.Q,
//   configFigures.K,
//   configFigures.B,
//   configFigures.N,
//   configFigures.R
// ];

export const boardCoordsX = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ];
export const boardCoordsY = [ '8', '7', '6', '5', '4', '3', '2', '1' ];

export const chessConfigView = {
  history: {
    node: 'chess_history',
    title: 'chess_history_header',
    wrapper: 'chess_history_items',
    item: 'chess_history_item',
    figure: 'chess_history_figure',
    text: 'chess_history_moves'
  },
  figure: 'drag-item',
  boardView: {
    boardView: 'chess_board_view',
    cell: 'chess_board_cell',
    light: 'cell-light',
    dark: 'cell-dark'
  },
  gameField: {
    board: 'chess_board',
    field: 'chess_field',
    cell: 'chess_cell',
    hover: 'chess_cell_hover'
  },
  chessView: {
    wrapper: 'chess_wrapper',
    controls: 'chess_controls',
    head: 'chess_head',
    player: 'chess_player',
    body: 'chess_body'
  },
  btn: {
    btnEnabled: 'chess_button',
    btnDisabled: 'disabled',
  },
  modal: {
    wrapper: 'modal_wrapper',
    message: 'modal_message',
    text: 'modal_text',
    btn: {
      btnEnabled: 'chess_button',
      btnDisabled: 'disabled',
    },
  }
};

// export default configField;
export default configFigures;
