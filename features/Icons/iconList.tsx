import { CheckBadgeIcon, CloudIcon, FireIcon } from '@heroicons/react/24/solid';


interface IIcons {
  [key: string]: {
    component: JSX.Element;
    keywords: string[];
  };
}

const IconList: IIcons = {
  cloud: {
    component: <CloudIcon className='text-blue-500' />,
    keywords: ['rain', 'cloud'],
  },
  check: { component: <CheckBadgeIcon />, keywords: ['todo', 'check'] },
  fire: {
    component: <FireIcon className='text-danger-200' />,
    keywords: ['fire', 'hot'],
  },
};

export default IconList;
