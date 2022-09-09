import {
  AcademicCapIcon,
  CalendarDaysIcon,
  CalendarIcon,
  CheckBadgeIcon,
  CloudIcon,
  CodeBracketIcon,
  CodeBracketSquareIcon,
  CommandLineIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  FilmIcon,
  FireIcon,
  LinkIcon,
  VideoCameraIcon,
  WalletIcon
} from '@heroicons/react/24/solid';


interface IIcons {
  [key: string]: {
    component: JSX.Element;
    keywords: string[];
  };
}

const IconList: IIcons = {
  AcademicCapIcon: {
    component: <AcademicCapIcon />,
    keywords: ['academic', 'cap'],
  },
  CalendarDaysIcon: {
    component: <CalendarDaysIcon />,
    keywords: ['event', 'calendar', 'day'],
  },
  CalendarIcon: {
    component: <CalendarIcon />,
    keywords: ['event', 'calendar'],
  },
  CheckBadgeIcon: {
    component: <CheckBadgeIcon />,
    keywords: ['todo', 'check', 'badge'],
  },
  CloudIcon: {
    component: <CloudIcon />,
    keywords: ['rain', 'cloud'],
  },
  CodeBracketIcon: {
    component: <CodeBracketIcon />,
    keywords: ['code'],
  },
  CodeBracketSquareIcon: {
    component: <CodeBracketSquareIcon />,
    keywords: ['code'],
  },
  CommandLineIcon: {
    component: <CommandLineIcon />,
    keywords: ['command', 'line', 'code'],
  },
  ComputerDesktopIcon: {
    component: <ComputerDesktopIcon />,
    keywords: ['computer', 'desktop', 'code'],
  },
  CpuChipIcon: {
    component: <CpuChipIcon />,
    keywords: ['computer', 'cpu', 'code', 'chip'],
  },
  FilmIcon: {
    component: <FilmIcon />,
    keywords: ['film', 'movie'],
  },
  FireIcon: {
    component: <FireIcon />,
    keywords: ['fire', 'hot'],
  },
  LinkIcon: {
    component: <LinkIcon />,
    keywords: ['link', 'url'],
  },
  VideoCameraIcon: {
    component: <VideoCameraIcon />,
    keywords: ['video', 'camera', 'movie', 'filme'],
  },
  WalletIcon: {
    component: <WalletIcon />,
    keywords: ['money', 'wallet', 'badget'],
  },
};

export default IconList;
