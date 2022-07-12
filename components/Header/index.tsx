import { LoginIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React, { FC } from 'react';
import Logo from '../Logo';
import ThemeBtn from '../ThemeBtn';

const Header: FC = () => {
  return (
    <div
      className='flex justify-between items-center h-12  
    bg-gray-100 dark:bg-gray-800 dark:text-white px-4'>
      <Logo />
      <div className='flex items-center space-x-2'>
        <ThemeBtn />
        <Link href='/api/auth/login'>
          <a
            className='flex items-center space-x-1 p-1 rounded 
            bg-green-500 hover:bg-green-400 text-gray-100'>
            <LoginIcon className='icon-xs' />
            <span className='font-medium'>Log in</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Header;
