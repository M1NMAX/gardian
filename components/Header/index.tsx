import Link from 'next/link';
import React, { FC } from 'react';
import Logo from '../Logo';
import ThemeBtn from '../ThemeBtn';

const Header: FC = () => {
  return (
    <div
      className='h-10 border-b border-yellow-300 bg-white
        dark:bg-gray-900 dark:text-white px-2'>
      <div className='flex justify-between items-center'>
        <Logo />
        <div className='flex items-center space-x-2'>
          <ThemeBtn />
          <Link href='/api/auth/login'>
            <a className='btn btn-primary font-medium'>Log in</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
