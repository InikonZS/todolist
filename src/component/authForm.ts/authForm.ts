import { IAuthData } from './../../authPage';
import Button from '../../chess/modules/components/button';
import Control from '../../chess/modules/components/control';
import Input from '../../chess/modules/components/inputs';
import { AuthModel } from '../AuthModel';



export class AuthForm extends Control {
  field: HTMLDivElement;
  nameInput: Input;
  passwordInput: Input;
  submitButton: Button;
  cancelButton: Button;
  nav: HTMLDivElement;
  model: AuthModel = new AuthModel();
  validation: string;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'authform_wrapper')
    this.field = document.createElement('div');
    this.field.classList.add('authform_field');
    this.nav = document.createElement('div');
    this.nav.classList.add('authform_nav');
    this.nameInput = new Input(this.field, 'Name', async () => {
      console.log('done')
      const res = await this.model.authValidation(this.getData());
      return res === 'ok' ? null : 'Not found';
    },
      'enter your name', 'text');
    this.passwordInput = new Input(this.field, 'Password', (param) => {
      return null
    },
      'enter your password', 'password');
    this.submitButton = new Button(this.nav, 'Login');
    this.cancelButton = new Button(this.nav, 'Cancel');
    this.node.appendChild(this.field);
    this.node.appendChild(this.nav);
    this.submitButton.node.onclick = async () => {
      console.log(`${this.nameInput.getStatus()}---status`)
      const res = await this.model.authValidation(this.getData());
      res === 'ok' ? this.model.sendAuthData(this.getData()) : console.log('User not found');
      // this.node.remove();

    }
    this.cancelButton.node.addEventListener('click', () => {

      this.node.remove();
    })
  }
  getData(): IAuthData {
    const obj: IAuthData = {
      login: this.nameInput.getValue(),
      password: this.passwordInput.getValue(),
    };
    return obj;
  }
}
