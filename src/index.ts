import './styles.scss';
import { PopupService, popupService } from './component/Popupservice';
import { Component } from './utilities/Component';
import { Chat } from './component/chat/chatPage';
import { Main } from './component/Main';
import { Auth } from './authPage';
import { Route, Router } from './router';
import { Navigation } from './component/header/header';
import { ChessPage } from './chessPage';
import './style.css';
import { popupService1 } from './component/popupService/popupService1';
import { IPageComponent } from './utilities/interfaces';

class App extends Component {
  // header: Header;
  main: Main;

  chat: Chat;

  auth: Auth;

  popupLayer: Component;

  navigation: Navigation;

  router: Router;

  pageContainer: Component;

  chess: ChessPage;

  constructor(parentNode: HTMLElement, popupService: PopupService) {
    super(parentNode, 'div', ['page_wrapper']);
    popupService1.init(this.element);
    // this.header = new Header(this.element);
    this.navigation = new Navigation(this.element);
    this.router = new Router();
    this.pageContainer = new Component(this.element, 'div', ['page_main']);

    this.auth = new Auth(this.pageContainer.element);
    this.chat = new Chat(this.pageContainer.element);
    this.main = new Main(this.pageContainer.element);
    this.chess = new ChessPage(this.pageContainer.element);

    this.addPage('chat', 'chat', this.chat);
    this.addPage('авторизация', 'auth', this.auth);
    // this.addPage('тудушки', 'todos', this.main);
    // this.addPage('шахматы', 'shess', this.chess);

    this.popupLayer = new Component(this.element);
    popupService.init(this.popupLayer.element);

    this.router.processHash();
    this.auth.onLogout = () => {
      console.log('logged out');
      this.chat.leave();
    };
  }

  addPage(linkName: string, pageName:string, pageComponent:IPageComponent) {
    const route = new Route(pageName, linkName, () => {
      pageComponent.show();
      this.navigation.setActive(pageName);
    }, () => {
      pageComponent.hide();
    });

    this.navigation.addLink(linkName, pageName);
    this.router.addRoute(route);
  }
}

const app = new App(document.body, popupService);
(window as any).app = app;
