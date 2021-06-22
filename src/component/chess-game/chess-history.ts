import { Component } from 'utilities/Component';
import { boardCoordsX, boardCoordsY } from 'utilities/config-chess';
import { ICellCoords } from 'utilities/interfaces';

class ChessHistoryBlock extends Component {
  private historyWrapper: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'chess_history' ]);
    const historyHeader = new Component(this.element, 'div', [ 'chess_history_header' ]);
    historyHeader.element.textContent = 'History: ';
    this.historyWrapper = new Component(this.element, 'div', [ 'chess_history_items' ]);
  }

  setHistoryMove(coords: Array<ICellCoords>, time: string): void {
    const historyItem = new Component(this.historyWrapper.element, 'div', [ 'chess_history_item' ]);
    historyItem.element.textContent = `${boardCoordsX[coords[0].x]}${boardCoordsY[coords[0].y]}-${boardCoordsX[coords[1].x]}${boardCoordsY[coords[1].y]} ${time}`;
  }
}

export default ChessHistoryBlock;
