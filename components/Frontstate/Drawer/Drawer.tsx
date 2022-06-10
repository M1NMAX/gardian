import { XIcon } from '@heroicons/react/outline';
import React, { FC, ReactNode } from 'react';
import ActionIcon from '../ActionIcon';

interface IProps {
  children: ReactNode;
}

interface TitleProps {
  children: string;
}
interface DescriptionProps extends IProps {}
interface BodyProps extends IProps {}
interface FooterProps extends IProps {}

interface DrawerProps extends IProps {
  opened: boolean;
  onClose: () => void;
}
type DrawerComponent = FC<DrawerProps> & {
  Title: FC<TitleProps>;
} & {
  Description: FC<DescriptionProps>;
} & { Body: FC<BodyProps> } & { Footer: FC<FooterProps> };

const Drawer: DrawerComponent = (props) => {
  const { children, opened, onClose } = props;
  return (
    <div
      className={`${
        opened ? 'w-1/3 py-2 px-4' : 'w-0'
      } transition-all duration-200 ease-in-out flex flex-col
  rounded bg-gray-100 dark:bg-gray-800  overflow-hidden`}>
      <div className='flex justify-end'>
        <ActionIcon icon={<XIcon />} variant='filled' onClick={onClose} />
      </div>
      <div className='space-y-4'>{children}</div>
    </div>
  );
};

const Title: FC<TitleProps> = (props) => {
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

  return <div>{children}</div>;
};

Drawer.Title = Title;
Drawer.Description = Description;
Drawer.Body = Body;
Drawer.Footer = Footer;

export default Drawer;
