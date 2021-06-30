import { Component } from '../utilities/Component';
import { DashBoardController } from './Dashboardcontroller';
import { DashboardItem } from './Dashboarditem';
import { DashBoardModel, DashBoardServerModel } from './Dashboardmodel';
import { IDashboardRecord } from './IdashboardRecord';
import { popupService } from './Popupservice';

interface IDashboardItem{
  destroy: ()=>void;
}

type IDashboardItemConstructor = (parentNode: HTMLElement | null)=> IDashboardItem;

export class Dashboard extends Component {
  private items: Array<DashboardItem> = [];

  public model: DashBoardServerModel;

  private controller: DashBoardController;
  // ItemClass: IDashboardItemConstructor;

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', ['list']);
    //  this.ItemClass = ItemClass;
    this.model = new DashBoardServerModel();
    this.controller = new DashBoardController(this.model);
    this.model.state.onUpdate.add((data) => {
      this.setData(data);
    });
  }

  private addItem(data: IDashboardRecord, index: number) {
    const dashboardItem = new DashboardItem(this.element);
    dashboardItem.setData(data);
    dashboardItem.onDelete = () => {
      if (data._id) {
        this.controller.deleteItem(data._id);
      } else {
        throw new Error('_id is undefined');
      }
    };

    dashboardItem.onEdit = () => {
      popupService.showEditPopup(
        async (obj) => {
          if (data._id) {
            this.controller.editItem(obj, data._id);
          } else {
            throw new Error('_id is undefined');
          }
          return null;
        },
        () => {},
        data,
      );
    };
    this.items.push(dashboardItem);
  }

  private setData(data: Array<IDashboardRecord>) {
    this.clear();
    data.forEach((item, index) => this.addItem(item, index));
  }

  private clear() {
    this.items.forEach((item) => item.destroy());
    this.items = [];
  }
}
