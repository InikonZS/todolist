import { IAuthData } from '../../authPage';
import Button from '../../chess/modules/components/button';
import Control from '../../chess/modules/components/control';
import Input from '../../chess/modules/components/inputs';
import { AuthModel } from '../AuthModel';
import ButtonDefault from '../chat/button';


export class AuthForm extends Control {
  field: HTMLDivElement;

  nameInput: Input;

  passwordInput: Input;

  submitButton: Button;

  cancelButton: Button;

  nav: HTMLDivElement;

  // model: AuthModel = new AuthModel();
  model: AuthModel
  validation: string;
  checkData: Button;
  avatar: string;



  constructor(parentNode: HTMLElement,model:AuthModel) {
    super(parentNode, 'div', 'authform_wrapper');
    this.model = model;
    this.field = document.createElement('div');
    this.field.classList.add('authform_field');
    this.nav = document.createElement('div');
    this.nav.classList.add('authform_nav');

    this.nameInput = new Input(this.field, 'Name', async () => {
      console.log('done');
      const res = await this.model.authValidation(this.getData());
      if(res==='ok'){
        this.model.getPublicUserInfo(this.getData()).then((res)=>{
          if(res){
            this.field.style.backgroundImage = `url(${res.avatar})`
            this.avatar = res.avatar
          } else {
            this.field.style.backgroundImage = ``;
            this.avatar = ''
          }
          return null
        })
      } else {
        this.field.style.backgroundImage = ``
        return 'Not Found'
      }
    },
    'enter your name', 'text');
    this.passwordInput = new Input(this.field, 'Password', (param) => null,
      'enter your password', 'password');
    this.submitButton = new Button(this.nav, 'Login');
    this.checkData = new Button(this.nav,'check')
    this.cancelButton = new Button(this.nav, 'Cancel');
    this.node.appendChild(this.field);
    this.node.appendChild(this.nav);
    this.checkData.node.onclick = () => {
      this.model.getPublicUserInfo(this.getData()).then((res)=>{
        this.field.style.backgroundImage = `url(${res.avatar})`
      })
    }
    this.submitButton.node.onclick = async () => {
      console.log(`${this.nameInput.getStatus()}---status`);
      const res = await this.model.authValidation(this.getData());
      if (res === 'ok') {
        this.model.getPublicUserInfo(this.getData()).then((res)=>{
          return res
        })
        this.model.sendAuthData(this.getData())

      } else {
         console.log('User not found') }
      // this.node.remove();
    };
    this.cancelButton.node.addEventListener('click', () => {
      this.node.remove();
    });
  }

  getData(): IAuthData {
    const obj: IAuthData = {
      login: this.nameInput.getValue(),
      password: this.passwordInput.getValue(),
    };
    return obj;
  }
}
