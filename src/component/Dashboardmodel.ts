import Signal from "../utilities/signal";
import { IDashboardRecord } from "./IdashboardRecord";

const apiUrl = 'http://localhost:4040/todoListService/';
//const apiUrl = 'http://inikonapp.cloudno.de/todoListService/';

export class DashBoardModel {
  private items: Array<IDashboardRecord>;
  public onUpdate: Signal<Array<IDashboardRecord>> = new Signal();
  constructor() {
    this.items = [];
  }

  setData(data: Array<IDashboardRecord>) {
    const lastData = this.items;
    this.items = data;
    this.onUpdate.emit(this.items);
  }

  getData() {
    return this.items;
  }
}

class AddRecordResponse{
  status:string;
  error:string | null;

  constructor(rawResponse:any){
    if (!(typeof rawResponse.status === 'string')) { throw new Error('AddRecord response invalid')}
    this.status = rawResponse.status;
    this.error = rawResponse.error;
  }
}

export class DashBoardServerModel {
  state: DashBoardModel;
  constructor() {
    this.state = new DashBoardModel();
  }

  async getList() {
    fetch(`${apiUrl}read`).then(res => res.json()).then(list => {
      this.state.setData(list);
    })
  }

  async addRecord(record: IDashboardRecord) {
    let base64Record = btoa(JSON.stringify(record));
    return fetch(`${apiUrl}write?record=${base64Record}`).then(res => res.json()).then((result) => {
      return new AddRecordResponse(result);
      //return this.getList();
    });
  }

  deleteRecord(id:string) {
    fetch(`${apiUrl}delete?id=${id}`).then(res => res.text()).then(() => {
      this.getList();
    });
  }

  updateRecord(record: IDashboardRecord, id:string) {
    let base64Record = btoa(JSON.stringify(record));
    fetch(`${apiUrl}update?id=${id}&record=${base64Record}`).then(res => res.text()).then(() => {
      this.getList();
    });
  }

}