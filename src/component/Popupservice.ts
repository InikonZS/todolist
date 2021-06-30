import { EditPopup } from '../Editpopup';
import { IDashboardRecord } from './IdashboardRecord';

export class PopupService {
  private parentNode: HTMLElement | null = null;

  init(parentNode: HTMLElement) {
    this.parentNode = parentNode;
  }

  showEditPopup(
    onOk: (data: IDashboardRecord) => Promise<string | null>,
    onCancel: () => void,
    initialData?: IDashboardRecord,
  ) {
    const form = new EditPopup(this.parentNode, initialData);
    form.onOk = async (obj) => {
      const result = await onOk(obj);

      if (result === null) {
        form.destroy();
      }
      return result || '';
    };
    form.onCancel = () => {
      onCancel();
      form.destroy();
    };
  }
}

export const popupService = new PopupService();
