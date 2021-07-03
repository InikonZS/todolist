import { IPublicUserInfo, IUserAuth, IUserData } from 'utilities/interfaces';
import Signal from 'utilities/signal';
import { apiRequest } from 'utilities/utils';

interface IAuthData {
  login: string;
  password: string;
}
const apiUrl = 'http://localhost:4040/authService/';

export class AuthModel {
  onResult: Signal<string> = new Signal();
  public onLogIn: Signal<IUserAuth> = new Signal();

  constructor() {

  }

  sendAuthData(userData: IAuthData) {
    /* fetch(`${apiUrl}auth?login=${login}&password=${password}`).then(res => res.text()).then((data) => {
      console.log(data);
    }); */
    apiRequest(apiUrl, 'auth', userData).then((res: { session: string; login: string; avatar: string}) => {
      console.log(res);
      const loginData = {
        login: res.login,
        avatar: res.avatar
      }
      localStorage.setItem('todoListApplicationSessionId', res.session);
      this.onLogIn.emit(loginData)
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

  async registerUser(userData: IUserData) {
    const request = fetch(`${apiUrl}register`, { method: "POST", body: `login=${userData.login}&password=${userData.password}&avatar=${userData.avatar}` }).then(res => res.text()).then((data) => {
      console.log(data);
    });
    // const request = apiRequest(apiUrl, 'register', userData).then(res => {
    //   console.log(res);
    // });
    return request

  }

  regValidation(userData: IAuthData): Promise<string> {
    const status = apiRequest(apiUrl, 'regValidation', userData).then((res) => res.status);
    return status;
  }

  authValidation(userData: IAuthData): Promise<string> {
    const status = apiRequest(apiUrl, 'authValidation', userData).then((res) => res.status);
    return status;
  }

  passwordValidation(userData: IAuthData): Promise<string> {
    const status = apiRequest(apiUrl, 'passwordValidation', userData).then((res) => res.status);
    return status;
  }
  validateUser(userData: IAuthData): Promise<string> {
    const status = apiRequest(apiUrl, 'checkUser', userData).then((res) => {
      return res.status;
    })
    return status
  }
  getPublicUserInfo(userData: IAuthData): Promise<IPublicUserInfo> {
    const userInfo = apiRequest(apiUrl, 'getPublicUserInfo', userData).then((res) => {
      return {
        login: res.login,
        avatar: res.avatar
      };
    })
    return userInfo
  }


}
