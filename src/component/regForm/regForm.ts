import { Avatar } from './avatar';
import { IAuthData } from './../../authPage';
import Control from '../../chess/modules/components/control';
import Button from '../../chess/modules/components/button';
import Input from '../../chess/modules/components/inputs';
import { AuthModel } from '../AuthModel';
import Signal from '../../chess/modules/components/signal';
import { IUserAuth, IUserData } from 'utilities/interfaces';



interface IInputState  {
  name : boolean,
  pass:boolean
}
export class RegForm extends Control {
  onChange : Signal<{}> = new Signal()
  field: HTMLDivElement;
  nameInput: Input;
  passwordInput: Input;
  submitButton: Button;
  cancelButton: Button;
  nav: HTMLDivElement;
  model: AuthModel
  note: HTMLDivElement;
  flag: boolean;
  nameFlag: boolean;
  passFlag: boolean;
  state: IInputState;
  avatarInput: Input;
  imgSrc: string;
  avatar : Avatar = new Avatar(this.node)
  public onLogIn: (param:IUserAuth) => void = () => {};
  constructor(parentNode: HTMLElement, model: AuthModel) {
    super(parentNode, 'div', 'authform_wrapper')
    this.model = model
    this.node.onclick = () =>{
      console.log('asdadad')
    }
    this.flag = false;
    this.field = document.createElement('div');
    this.field.classList.add('authform_field');
    this.nav = document.createElement('div');
    this.nav.classList.add('authform_nav');
    this.nameFlag = false;
    this.passFlag = false;
    //this.avatar = new Input(this.field,'Avatar', async ()=> {return ''  },'avatar','file')
    this.nameInput = new Input(this.field, 'Name', async () => {
      const res = await this.model.regValidation(this.getData());
      console.log(res)
      // return res === 'ok' ? null : 'Wrong name or user already exists';
      if(res==='ok'){
        this.state = {...this.state,name:true}
        if(this.state.name  && this.state.pass){
          this.submitButton.enable();
        } else{
          this.submitButton.disable();
        }
        return null
      } else {
        this.state = {...this.state,name:false};
        this.submitButton.disable();
        return 'Wrong name or user already exists';
      }
    },
      'enter your name', 'text');
     this.field.appendChild(this.avatar.node);
      this.passwordInput = new Input(this.field, 'Password', async () => {
        const res = await this.model.passwordValidation(this.getData());
        // return res === 'ok' ? null : 'Invalid password';
        if(res==='ok'){
          this.state = {...this.state,pass:true}
          if(this.state.name  && this.state.pass){
            this.submitButton.enable();
          } else{
            this.submitButton.disable();
          }
          return null
        } else {
          this.state = {...this.state,pass:false}
          this.submitButton.disable();
          return 'Invalid password';
        }
      },
        'enter your password', 'text');
    this.submitButton = new Button(this.nav, 'register');
    this.cancelButton = new Button(this.nav, 'cancel');
    this.node.appendChild(this.field);
    this.node.appendChild(this.nav);
    this.note = document.createElement('div')
    this.note.innerText = `Name length Minimum 3  &  Maximum 20 characters Only letters allowed ,
                           password Minimum eight characters, at least one uppercase letter, one
                           lowercase letter and one number`;
    this.node.appendChild(this.note);
    this.submitButton.disable();
    this.state  = {name:false,pass:false};
    this.submitButton.node.addEventListener('click', () => {
      const alert = document.createElement('div');
      alert.innerText = 'Not valid or this name already exists';
      this.model.regValidation(this.getData()).then(async (res) => {
        console.log(res);
        if (res == 'ok') {
          const res = await this.model.passwordValidation(this.getData());
          res === 'ok' ? this.model.registerUser(this.getAuthData()) : console.log('wrong');
        } else {
          this.field.appendChild(alert);
        }
      })
    })
    this.cancelButton.node.addEventListener('click', () => {
      this.node.remove();
    });
    model.onLogIn.add((data) => {
      this.onLogIn(data)
    });
  }
  getData(): IAuthData {
    const obj: IAuthData = {
      login: this.nameInput.getValue(),
      password: this.passwordInput.getValue(),
    };
    return obj;
  }
  getAuthData(): IUserData {
    const obj: IUserData = {
      login: this.nameInput.getValue(),
      password: this.passwordInput.getValue(),
      avatar:this.avatar.getValue()
    };
    return obj;
  }
}
