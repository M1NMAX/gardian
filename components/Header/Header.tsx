import { MenuAlt2Icon } from '@heroicons/react/outline';
import React, { FC, ReactNode } from 'react';
import ActionIcon from '../Frontstate/ActionIcon';

interface HeaderProps {
  title: string;
  sidebar: boolean;
  children: ReactNode;
  onClickMenuBtn: () => void;
}

const Header: FC<HeaderProps> = (props) => {
  const { title, sidebar, children, onClickMenuBtn } = props;
  return (
    <div className='sticky top-0 pt-2 px-4 bg-white dark:bg-gray-900 dark:text-white'>
      <div className='space-y-1 pb-1 border-dotted border-b-2 border-gray-200 dark:border-gray-700'>
        {/* Menu btn  */}
        {!sidebar && (
          <ActionIcon icon={<MenuAlt2Icon />} onClick={onClickMenuBtn} />
        )}

        {/* Title   */}
        <div className='flex items-center space-x-1'>
          <h1 className='grow font-semibold text-xl md:text-2xl pl-1 border-l-4 border-primary-100'>
            {title}
          </h1>
          <div className='flex items-center space-x-1.5'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
