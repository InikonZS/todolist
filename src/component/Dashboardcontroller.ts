import { DashBoardModel, DashBoardServerModel } from './Dashboardmodel';
import { IDashboardRecord } from './IdashboardRecord';

export class DashBoardController {
  constructor(private model: DashBoardServerModel) {}

  deleteItem(id:string) {
    this.model.deleteRecord(id);
    /* this.model.setData(
        this.model.getData().filter((item, i) => {
          return index !== i;
        })
      ); */
  }

  editItem(obj: IDashboardRecord, id:string) {
    this.model.updateRecord(obj, id);
    /* this.model.setData(
        this.model.getData().map((item, i) => {
          if (index == i) {
            return obj;
          }
          return item;
        })
      ); */
  }
}
