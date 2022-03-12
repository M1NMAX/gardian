import React, { FC } from 'react';
import Logo from '../Logo';
import ThemeBtn from '../ThemeBtn';
import { UserIcon } from '@heroicons/react/outline';

const Header: FC = () => {
    return (
        <div className='h-12 border-b border-yellow-300 bg-white
        dark:bg-gray-900 dark:text-white px-2'>
            <div className='flex justify-between items-center'>
                <Logo />
                <div className='flex items-center space-x-2'>
                    <ThemeBtn />
                    <UserIcon className='icon-md' />
                </div>
            </div>
        </div>
    )
}

export default Header