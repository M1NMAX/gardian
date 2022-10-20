import { Button } from 'flowbite-react';
import React, { FC, ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';


interface DrawerProps {
  children: ReactNode;
  title?: ReactNode;
  menu?: ReactNode;
  opened: boolean;
  onClose: () => void;
}

const Drawer: FC<DrawerProps> = (props) => {
  const { children, title, menu, opened, onClose } = props;
  return (
    <div
      className={`${
        opened ? 'h-full w-full z-10 md:w-2/5 py-2 px-1.5' : 'w-0'
      } transition-all duration-200 ease-in-out flex flex-col
   bg-gray-100 dark:bg-gray-800 dark:text-white overflow-hidden`}>
      <div
        className='flex justify-between pb-1 border-dotted 
                      border-b-2 border-gray-200 dark:border-gray-700'>
        <Button color='gray' onClick={onClose}>
          <XMarkIcon className='icon-sm' />
        </Button>
        <span className='grow px-1.5'>{title}</span>
        {menu}
      </div>
      <div className='grow flex flex-col justify-between space-y-1 overflow-hidden'>
        {children}
      </div>
    </div>
  );
};

export default Drawer;
