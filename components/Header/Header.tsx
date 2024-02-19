import { Button } from 'flowbite-react';
import React, { FC, ReactNode } from 'react';
import { useSidebarContext } from '@context/SidebarContext';
import { Bars3BottomLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';


interface HeaderProps {
  children: ReactNode;
}

const Header: FC<HeaderProps> = (props) => {
  const { children } = props;

  const sidebar = useSidebarContext();

  return (
    <div className='sticky top-0 pt-2 px-4 bg-white dark:bg-gray-900 dark:text-white'>
      <div className='space-y-1 pb-1 border-dotted border-b-2 border-gray-200 dark:border-gray-700'>
        {/* Menu btn  */}

        <div className='flex'>
          {!sidebar.isOpenOnSmallScreens && (
            <Button
              color='gray'
              size='wfull'
              onClick={() => sidebar.setOpenOnSmallScreens(true)}>
              <Bars3BottomLeftIcon className='icon-sm' />
            </Button>
          )}
          <button
            className='grow w-full space-x-2 flex items-center rounded p-1
             bg-gray-300 dark:bg-gray-700'>
            <MagnifyingGlassIcon className='icon-sm' />
            <span>Find, explore</span>
          </button>
        </div>
        {/* Title   */}
        <div className='flex items-center space-x-1'>{children}</div>
      </div>
    </div>
  );
};

export default Header;
