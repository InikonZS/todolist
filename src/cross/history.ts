import { Component } from '../utilities/Component';
import { ICellCoords } from '../utilities/interfaces';

class HistoryBlock extends Component {
  private historyWrapper: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['cross_history']);
    const historyHeader = new Component(this.element, 'div', ['cross_history_header']);
    historyHeader.element.textContent = 'History: ';
    this.historyWrapper = new Component(this.element, 'div', ['cross_history_items']);
  }

  setHistoryMove(sigh: string, coords: ICellCoords, time: string): void {
    const historyItem = new Component(this.historyWrapper.element, 'div', ['cross_history_item']);
    historyItem.element.textContent = `${sigh} ${coords.x}-${coords.y} ${time}`;
  }
}

export default HistoryBlock;
