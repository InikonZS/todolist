import { Component } from '../utilities/Component';
import { IDashboardRecord } from './IdashboardRecord';

export class DashboardItem extends Component {
  title: Component;
  content: Component;
  button: Component;

  onDelete: (() => void) | null = null;
  onEdit: (() => void) | null = null;
  buttonEdit: Component;
  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', ['list__item']);

    this.title = new Component(this.element, 'div', ['list__label', 'list__label_task']);
    this.content = new Component(this.element, 'div', ['list__input', 'list__input_task']);
    this.button = new Component(this.element, 'button', ['button', 'list__button-delete'], `<img class="list__button-img" src="https://nata-roma.github.io/clean-code-s1e1/clean-code-s1e1/remove.svg" alt="">`);
    this.buttonEdit = new Component(this.element, 'button', ['button', 'list__button-edit'], 'EDIT',);
    
    this.button.element.onclick = () => {
      if (this.onDelete) {
        this.onDelete();
      }
    };

    this.buttonEdit.element.onclick = () => {
      if (this.onEdit) {
        this.onEdit();
      }
    };
  }

  setData(data: IDashboardRecord) {
    this.title.element.innerHTML = data.title;
    this.content.element.innerHTML = data.content;
  }
}

//       <li class="task-list__item">		     
//		      <label class="all-item__task todo__task">Pay Bills</label>
//		      <input class="text__input all-item__task" type="text">
//		      <button class="edit">Edit</button>
//		      <button class="delete"><img src="./remove.svg" alt="Delete button icon"></button>
//		    </li>
