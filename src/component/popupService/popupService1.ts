import { Component } from "utilities/Component";
// import { GameSelect } from "../chat/game-select";
import { GenericPopup } from "../chat/genericPopup";
import './popupService.css';

class PopupService1 extends Component {
  constructor() {
    super(null, 'div', ['popup_layer']);
  }

  init(parentNode:HTMLElement) {
    parentNode.append(this.element);
  }

  showPopup<type>(Popup: any):Promise<type> {
    return new Promise((resolve, reject) => {
      const popup = new Popup(this.element);
      popup.onSelect = (result: type) => {
        resolve(result);
        popup.destroy();
      }
    })
  }
}

export const popupService1 = new PopupService1();
