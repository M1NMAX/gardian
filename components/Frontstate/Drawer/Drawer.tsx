import React, { FC, ReactNode } from 'react';
import ActionIcon from '../ActionIcon';
import { XIcon } from '@heroicons/react/outline';
import { title } from 'process';

interface IProps {
  children: ReactNode;
}

interface HeaderProps {
  children: ReactNode;
}
interface DescriptionProps extends IProps {}
interface BodyProps extends IProps {}
interface FooterProps extends IProps {}

interface DrawerProps extends IProps {
  title?: ReactNode;
  menu?: ReactNode;
  opened: boolean;
  onClose: () => void;
}
type DrawerComponent = FC<DrawerProps> & {
  Header: FC<HeaderProps>;
} & {
  Description: FC<DescriptionProps>;
} & { Body: FC<BodyProps> } & { Footer: FC<FooterProps> };

const Drawer: DrawerComponent = (props) => {
  const { children, title, menu, opened, onClose } = props;
  return (
    <div
      className={`${
        opened ? 'h-screen w-full z-10 md:w-2/5 py-2 px-1.5' : 'w-0'
      } transition-all duration-200 ease-in-out flex flex-col
  rounded bg-gray-100 dark:bg-gray-800 overflow-hidden`}>
      <div className='flex justify-between'>
        <ActionIcon icon={<XIcon />} variant='filled' onClick={onClose} />
        <span className='grow px-1.5'>{title}</span>
        {menu}
      </div>
      <div
        className='pt-2 grow overflow-y-auto scrollbar-none scrollbar-thumb-gray-300
                   dark:scrollbar-thumb-gray-600'>
        {children}
      </div>
    </div>
  );
};

const Header: FC<HeaderProps> = (props) => {
  const { children } = props;

  return <h1 className='font-semibold text-xl'>{children}</h1>;
};
const Description: FC<DescriptionProps> = (props) => {
  const { children } = props;

  return <div>{children}</div>;
};
const Body: FC<BodyProps> = (props) => {
  const { children } = props;

  return <div>{children}</div>;
};
const Footer: FC<FooterProps> = (props) => {
  const { children } = props;

  return (
    <div className='mt-2 pt-1 border-dashed border-t border-green-200'>
      {children}
    </div>
  );
};

Drawer.Header = Header;
Drawer.Description = Description;
Drawer.Body = Body;
Drawer.Footer = Footer;

export default Drawer;
