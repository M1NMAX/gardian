import {
  CheckBadgeIcon,
  CloudIcon,
  FireIcon,
  WalletIcon
} from '@heroicons/react/24/solid';


interface IIcons {
  [key: string]: {
    component: JSX.Element;
    keywords: string[];
  };
}

const IconList: IIcons = {
  check: { component: <CheckBadgeIcon />, keywords: ['todo', 'check'] },
  cloud: {
    component: <CloudIcon className='text-blue-500' />,
    keywords: ['rain', 'cloud'],
  },
  fire: {
    component: <FireIcon className='text-danger-200' />,
    keywords: ['fire', 'hot'],
  },
  wallet: {
    component: <WalletIcon />,
    keywords: ['money', 'wallet', 'badget'],
  },
};

export default IconList;
