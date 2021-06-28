import { Component } from 'utilities/Component';
import configFigures, { boardCoordsX, boardCoordsY } from 'utilities/config-chess';
import { ICellCoords, IHistoryView } from 'utilities/interfaces';
import Vector from 'utilities/vector';

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

  setHistoryMove(coords: Array<Array<Vector>>, time: string, figName: Array<string>): void {
    coords.forEach((coord, i) => {
      const historyItem = new Component(this.historyWrapper.element, 'div', [ this.config.item ]);
      const historyFigure = new Component(historyItem.element, 'div', [ this.config.figure ]);
      historyFigure.element.style.backgroundImage = `url(${configFigures.get(figName[i])})`;
      const historyText = new Component(historyItem.element, 'div', [ this.config.text ]);

      historyText.element.textContent = `${boardCoordsX[coord[0].x]}${boardCoordsY[
        coord[0].y
      ]}-${boardCoordsX[coord[1].x]}${boardCoordsY[coord[1].y]} ${time}`;
    });
  }

  setLangView(configLang: string): void {
    this.historyHeader.element.textContent = configLang;
  }
}

export default ChessHistoryBlock;
