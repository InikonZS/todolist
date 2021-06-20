import Chess from './chess/modules/chess';
import { Component } from './utilities/Component';

export class ChessPage extends Component {
  public game: Chess;

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', ['main']);
    this.game = new Chess(this.element);
  }

}