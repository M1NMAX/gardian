import {
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  ArchiveBoxIcon,
  BanknotesIcon,
  Battery0Icon,
  Battery100Icon,
  Battery50Icon,
  BeakerIcon,
  BellAlertIcon,
  BellIcon,
  BellSlashIcon,
  BellSnoozeIcon,
  BoltIcon,
  BoltSlashIcon,
  BookOpenIcon,
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
  AdjustmentsHorizontalIcon: {
    component: <AdjustmentsHorizontalIcon />,
    keywords: ['adjustment', 'settings'],
  },
  ArchiveBoxIcon: {
    component: <ArchiveBoxIcon />,
    keywords: ['archive', 'box'],
  },
  BanknotesIcon: {
    component: <BanknotesIcon />,
    keywords: ['bank', 'note', 'money'],
  },
  Battery0Icon: {
    component: <Battery0Icon />,
    keywords: ['battery', 'charge', '0'],
  },
  Battery50Icon: {
    component: <Battery50Icon />,
    keywords: ['battery', 'charge', '50', 'half'],
  },
  Battery100Icon: {
    component: <Battery100Icon />,
    keywords: ['battery', 'charge', '100', 'full'],
  },
  BeakerIcon: {
    component: <BeakerIcon />,
    keywords: ['beaker', 'chemistry'],
  },
  BellAlertIcon: {
    component: <BellAlertIcon />,
    keywords: ['bell', 'alert', 'notification'],
  },
  BellSlashIcon: {
    component: <BellSlashIcon />,
    keywords: ['bell', 'mute', 'notification'],
  },
  BellSnoozeIcon: {
    component: <BellSnoozeIcon />,
    keywords: ['bell', 'snooze', 'alarm'],
  },
  BellIcon: {
    component: <BellIcon />,
    keywords: ['bell', 'alarm'],
  },
  BoltIcon: {
    component: <BoltIcon />,
    keywords: ['bolt', 'flash'],
  },
  BoltSlashIcon: {
    component: <BoltSlashIcon />,
    keywords: ['bolt', 'slash'],
  },
  BookOpenIcon: {
    component: <BookOpenIcon />,
    keywords: ['book', 'open', 'read'],
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
