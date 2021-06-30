import { Component } from '../utilities/Component';

export class Header extends Component {
  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'aside', ['aside'], `<img class="aside__img" src="https://nata-roma.github.io/clean-code-s1e1/clean-code-s1e1/eisenhower-matrix.jpg" alt="matrix poster">
      <a class="aside__link" href="https://goal-life.com/page/method/matrix-eisenhower">Want more details?</a>`);
  }
}
