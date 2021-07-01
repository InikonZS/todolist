import defaultAvatar from '../assets/default-avatar.png';
import logoImage from '../assets/logo.png';

const configHeader = {
  wrapper: 'header_wrapper',
  logo: {
    logo: 'header_logo',
    image: logoImage
  },
  nav:{
    container: 'header_nav',
  },
  controls: {
    wrapper: 'auth_controls',
    btn: 'auth_button',
    hidden: 'default_hidden'
  },
  user: {
    wrapper: 'header_auth',
    user: 'auth_user',
    avatar: 'auth_avatar',
    nickName: 'auth_nickname',
    defaultAvatar: defaultAvatar,
  }
}

export default configHeader;

