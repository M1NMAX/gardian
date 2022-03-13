import React, { FC } from 'react';
import Logo from '../Logo';
import ThemeBtn from '../ThemeBtn';

const Header: FC = () => {
    return (
        <div className='h-12 border-b border-yellow-300 bg-white
        dark:bg-gray-900 dark:text-white px-2'>
            <div className='flex justify-between items-center'>
                <Logo />
                <div className='flex items-center space-x-2'>
                    <ThemeBtn />
                    <a  href='/api/auth/login' className='font-medium rounded px-2 hover:bg-gray-300'>Log in</a>
                </div>
            </div>
        </div>
    )
}

export default Header