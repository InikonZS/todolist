import { Component } from 'utilities/Component';
import { boardCoordsX, boardCoordsY } from 'utilities/config-chess';
import { ICellCoords, IHistoryView } from 'utilities/interfaces';

class ChessHistoryBlock extends Component {
  private historyWrapper: Component;
  private config: IHistoryView;
  private historyHeader: Component;

  constructor(parentNode: HTMLElement, config: IHistoryView, configLang: string) {
    super(parentNode, 'div', [ config.node ]);
    this.config = config;
    this.historyHeader = new Component(this.element, 'div', [ config.title ]);
    this.historyHeader.element.textContent = configLang;
    this.historyWrapper = new Component(this.element, 'div', [ config.wrapper ]);
  }

  setHistoryMove(coords: Array<ICellCoords>, time: string): void {
    const historyItem = new Component(this.historyWrapper.element, 'div', [ this.config.item ]);
    historyItem.element.textContent = `${boardCoordsX[coords[0].x]}${boardCoordsY[coords[0].y]}-${boardCoordsX[coords[1].x]}${boardCoordsY[coords[1].y]} ${time}`;
  }

  setLangView(configLang: string):void {
    this.historyHeader.element.textContent = configLang;
  }
}

export default ChessHistoryBlock;
