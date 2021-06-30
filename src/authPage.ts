import { Component } from './utilities/Component';
import { popupService } from './component/Popupservice';
import Signal from './utilities/signal';
import { digestMessage, apiRequest } from './utilities/utils';
import { RegForm } from './component/regForm/regForm';
import { AuthForm } from './component/authForm.ts/authForm';

const apiUrl = 'http://localhost:4040/authService/';

export interface IAuthData{
  login:string;
  password:string;
}

class AuthModel {
  onResult: Signal<string> = new Signal();

  constructor() {

  }

  sendAuthData(userData: IAuthData) {
    /* fetch(`${apiUrl}auth?login=${login}&password=${password}`).then(res => res.text()).then((data) => {
      console.log(data);
    }); */
    apiRequest(apiUrl, 'auth', userData).then((res) => {
      console.log(res);
      localStorage.setItem('todoListApplicationSessionId', res.session);
    });
  }

  testAccess() {
    /* fetch(`${apiUrl}auth?login=${login}&password=${password}`).then(res => res.text()).then((data) => {
      console.log(data);
    }); */
    apiRequest(apiUrl, 'testAccess', {}).then((res) => {
      console.log(res);
    });
  }

  registerUser(userData: IAuthData) {
    /* fetch(`${apiUrl}register?login=${login}&password=${password}`).then(res => res.text()).then((data) => {
      console.log(data);
    }); */
    apiRequest(apiUrl, 'register', userData).then((res) => {
      console.log(res);
    });
  }
}

export class Auth extends Component {
  loginInput: Component;

  passwordInput: Component;

  sendButton: Component;

  model: AuthModel = new AuthModel();

  reg: RegForm = new RegForm(this.element);

  auth: AuthForm = new AuthForm(this.element);

  onLogout : () => void;

  logoutButton: Component;

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', ['main']);
    this.loginInput = new Component(this.element, 'input');
    this.passwordInput = new Component(this.element, 'input');
    this.sendButton = new Component(this.element, 'button', [], 'auth');
    this.logoutButton = new Component(this.element, 'button', [], 'logout');
    this.logoutButton.element.onclick = () => {
      this.onLogout?.();
      localStorage.removeItem('todoListApplicationSessionId');
    };
    this.sendButton.element.onclick = () => {
      this.model.sendAuthData(this.getData());
    };

    const testButton = new Component(this.element, 'button', [], 'test access');
    testButton.element.onclick = () => {
      this.model.testAccess();
    };
  }

  getData(): IAuthData {
    const obj: IAuthData = {
      login: (this.loginInput.element as HTMLInputElement).value,
      password: (this.passwordInput.element as HTMLInputElement).value,
    };
    return obj;
  }
}
