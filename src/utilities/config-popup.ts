import chessIcon from '../assets/chess.png';
import crossIcon from '../assets/cross.png';

import oneScreenIcon from '../assets/chess-one-screen.png';
import networkIcon from '../assets/chess-game-network.png';
import botIcon from '../assets/chess-game-bot.png';


export const gameSetPopup = [ 'chess', 'cross' ];
export const gameModePopup = [ 'oneScreen' , 'network', 'bot', ];

export const gameIcons = new Map<string, string>([
  [ 'chess', chessIcon ],
  [ 'cross', crossIcon ]
]);

export const chessSettingIcons = new Map<string, string>([
  ['oneScreen', oneScreenIcon ], 
  ['network', networkIcon], 
  ['bot', botIcon]
])