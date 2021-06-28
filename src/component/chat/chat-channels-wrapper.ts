import { Component } from "utilities/Component";
import { IChannelBtn, IChannelDTO, IChannelWrapper } from "utilities/interfaces";
import ButtonDefault from "./button";
import ChatChannel from "./chat-chanel";

class ChatChannelsWrapper extends Component {
  private channels: Array<ChatChannel>;
  private chatChannels: Component;
  public onChannelClick: (name: string) => void = () => {};
  public onAddBtnClick: () => void = () => {};
  private configView: IChannelWrapper;
  private channelAddBtn: ButtonDefault;

  constructor(parentNode: HTMLElement, configView: IChannelWrapper, configLang: IChannelBtn) {
    super(parentNode, 'div', [ configView.wrapper ]);
    this.configView = configView;
    const chatChannelControl = new Component(this.element, 'div', [configView.constrols]);
    this.channelAddBtn = new ButtonDefault(chatChannelControl.element, configView.btn, configLang.btn);
    this.channelAddBtn.onClick = () => {
      this.onAddBtnClick();
    }
    this.chatChannels = new Component(this.element, 'div', [configView.channels]);

  }

  addChannels(channelList: IChannelDTO[]): void  {
    this.chatChannels.destroy();
    this.chatChannels = new Component(this.element, 'div', [this.configView.channels]);
    this.channels = channelList.map((channelData: IChannelDTO) => {
      const channel = new ChatChannel(this.chatChannels.element, this.configView.channel);
      channel.element.textContent = channelData.name;
      channel.onClick = () => {
        this.onChannelClick(channelData.name);
      }
      return channel;
    });
  }

  setLangView(configLang: IChannelBtn):void {
   this.channelAddBtn.setLangView(configLang.btn);
  }
}

export default ChatChannelsWrapper;
