import { Component } from "../../utilities/Component";
import { IChannelDTO } from "../../utilities/interfaces";
import ButtonDefault from "./button";
import ChatChannel from "./chat-chanel";

class ChatChannelsWrapper extends Component {
  private channels: Array<ChatChannel>;
  private chatChannels: Component;
  public onChannelClick: (name: string) => void = () => {};
  public onAddBtnClick: () => void = () => {};

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', [ 'chat_channels' ]);
    const chatChannelControl = new Component(this.element, 'div', ['chat_channels_controls']);
    const channelAddBtn = new ButtonDefault(chatChannelControl.element);
    channelAddBtn.onClick = () => {
      this.onAddBtnClick();
    }
    this.chatChannels = new Component(this.element, 'div', ['chat_channels_list']);

  }

  addChannels(channelList: IChannelDTO[]): void  {
    this.channels = channelList.map((channelData: IChannelDTO) => {
      const channel = new ChatChannel(this.chatChannels.element);
      channel.element.textContent = channelData.name;
      channel.onClick = () => {
        this.onChannelClick(channelData.name);
      }
      return channel;
    });
  }
}

export default ChatChannelsWrapper;
