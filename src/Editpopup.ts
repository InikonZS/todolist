import { Component } from './utilities/Component';
import { IDashboardRecord } from './component/IdashboardRecord';

export class EditPopup extends Component {
  titleInput: Component;

  contentInput: Component;

  okButton: Component;

  cancelButton: Component;

  onOk: ((data: IDashboardRecord) => Promise<string>) | null = null;

  onCancel: (() => void) | null = null;

  errorField: Component;

  constructor(
    parentNode: HTMLElement | null = null,
    initialData?: IDashboardRecord,
  ) {
    super(parentNode);
    this.titleInput = new Component(this.element, 'input');
    this.contentInput = new Component(this.element, 'input');
    this.okButton = new Component(this.element, 'button');
    this.cancelButton = new Component(this.element, 'button');
    this.okButton.element.onclick = async () => {
      if (this.onOk) {
        const result = await this.onOk(this.getData());
        this.setError(result);
      }
    };
    this.cancelButton.element.onclick = () => {
      this.onCancel?.();
    };

    this.errorField = new Component(this.element, 'div');
    if (initialData) {
      this.setData(initialData);
    }
  }

  setError(str: string) {
    this.errorField.element.innerHTML = str;
  }

  destroy() {
    super.destroy();
  }

  setData(obj: IDashboardRecord) {
    (this.titleInput.element as HTMLInputElement).value = obj.title;
    (this.contentInput.element as HTMLInputElement).value = obj.content;
  }

  getData(): IDashboardRecord {
    const obj: IDashboardRecord = {
      title: (this.titleInput.element as HTMLInputElement).value,
      content: (this.contentInput.element as HTMLInputElement).value,
    };
    return obj;
  }
}
