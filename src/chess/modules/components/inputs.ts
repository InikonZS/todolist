import Control from './control';
import Signal from './signal';

class Input extends Control {
  public node: HTMLInputElement;
  public onValidate: (param: string) => Promise<string | null>;
  public onInput: Signal<string | void> = new Signal();
  public onChange: Signal<string | void> = new Signal();
  error: Control;
  field: Control;
  caption: Control;
  name: string;
  private timer: NodeJS.Timeout;
  state: string;
  constructor(parentNode: HTMLElement, caption: string, onValidate: (param: string) => Promise<string | null>, placeHolder: string = '', type: string, id = 'input') {
    super(parentNode, 'div', 'authform_input');
    this.name = caption;
    this.caption = new Control(this.node, 'div', 'caption');
    this.caption.node.innerHTML = caption;
    this.field = new Control(this.node, 'input', 'field_input', `${id}`);
    (this.field.node as HTMLInputElement).type = type;
    (this.field.node as HTMLInputElement).placeholder = `${placeHolder}`;
    (this.field.node as HTMLInputElement).autocomplete = "off";
    this.error = new Control(this.node, 'div', 'input_error');
    this.onValidate = onValidate;
    this.state = 'no';
    this.field.node.classList.add('invalid')
    this.field.node.oninput = async () => {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        if (this.onValidate) {
          this.setError(await this.onValidate(this.getValue()));
        }
      }, 2000);
    }
  }
  getValue() {
    let inputValue = (this.field.node as HTMLInputElement).value;
    return inputValue;
  }
  setError(err: string | null) {
    if (err === null) {
      this.state = 'ок';
      this.error.node.innerHTML = 'ok';
      this.field.node.classList.remove('invalid');
      this.field.node.classList.add('valid');
    } else {
      this.state = 'no';
      this.error.node.textContent = err;
      this.field.node.classList.add('invalid')
      this.field.node.classList.remove('valid');
    }

  }
  getStatus (){
    return this.error.node.textContent
  }
  //     clearInput(){
  //         (this.field.element as HTMLInputElement).value = '';
  //         this.field.element.classList.add('invalid');
  //         if (this.onValidate) {
  //             this.setError(this.onValidate(this.getValue()));
  //         }
  //         if (this.onChange) {
  //             this.onChange.emmit(`${this.field.element.classList[1]==='valid' && (this.field.element as HTMLInputElement).value !==''}` )
  //             this.setError(this.onValidate(this.getValue()));
  //         }
  //     }

}

export default Input;
