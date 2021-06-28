import { Component } from "../utilities/Component";
import { ControlPanel } from "./Controlpanel";
import { Dashboard } from "./Dashboard";
import { popupService } from "./Popupservice";
import { IPageComponent } from '../utilities/interfaces';

const ArrData = [
  {
    title: 'Task1',
    content: 'Content',
  },
  {
    title: 'Task2',
    content: 'Content2',
  },
  {
    title: 'Task3',
    content: 'Content3',
  },
];

export class Main extends Component implements IPageComponent {
    controlPanel: ControlPanel;

    dashboard: Dashboard;
    constructor(parentNode: HTMLElement | null = null) {
      super(parentNode, 'div', ['main']);
      this.controlPanel = new ControlPanel(this.element);
      this.dashboard = new Dashboard(this.element);

      //this.dashboard.model.setData(ArrData);
      this.dashboard.model.getList();
      this.controlPanel.onAddClick = () => {
        popupService.showEditPopup(
          (obj) => {
            //if (obj.title.length < 3) return 'Title should be .....';
            return this.dashboard.model.addRecord(obj).then(result=>{
              console.log(result);
              if (result.status == 'ok'){
                this.dashboard.model.getList();
                return null;
              } else {
                return result.error || 'Invalid input';
              }
            });
            /*this.dashboard.model.setData([
              ...this.dashboard.model.getData(),
              obj,
            ]);*/


          },
          () => {}
        );
      };
    }

  }
