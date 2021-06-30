const chatConfigView = {
  wrapper: 'chat_wrapper',
  main: 'chat_main',
  action: 'chat_action',
  channelWrapper: {
    wrapper: 'chat_channels',
    constrols: 'chat_channels_controls',
    channels: 'chat_channels_list',
    channel: 'chat_channel',
    btn: 'default_button',
  },
  messageWrapper: {
    wrapper: 'chat_messages',
    message: {
      block: 'chat_message',
      wrapper: 'message_wrapper',
      avatar: 'message_avatar',
      main: 'message_main',
      header: 'message_header',
      user: 'message_user',
      date: 'message_date',
      body: 'message_body',
    },
  },
  inputWrapper: {
    wrapper: 'chat_input',
    field: 'chat_input_field',
    button: 'chat_send_button',
  },
  users: {
    wrapper: 'chat_users',
    category: 'chat_category',
    categoryName: 'chat_category_name',
    user: {
      wrapper: 'chat_user',
      avatar: 'default_avatar_small',
      name: 'default_name',
    },
  },
};

export default chatConfigView;
