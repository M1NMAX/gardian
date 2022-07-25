import { useUser } from '@auth0/nextjs-auth0';
import { Popover, Transition } from '@headlessui/react';
import { LogoutIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React, { Fragment } from 'react';
import Image from 'next/image';
import logoSrc from '../../../public/logo192.png';

const SidebarUserPopoverMenu = () => {
  const { user, isLoading } = useUser();

  return (
    <Popover className='relative'>
      <Popover.Button className='action-icon-hover-variant rounded'>
        {isLoading ? (
          <div
            className='h-6 w-6  animate-pulse rounded-full 
         bg-gray-400 dark:bg-gray-600'></div>
        ) : (
          <div className='relative w-6 h-6'>
            <Image
              src={user?.picture || logoSrc}
              layout='fill'
              objectFit='contain'
              className=' p-2 rounded-full border-2 border-white'
              alt='user profile picture'
            />
          </div>
        )}
      </Popover.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 translate-y-1'
        enterTo='opacity-100 translate-y-0'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100 translate-y-0'
        leaveTo='opacity-0 translate-y-1'>
        <div className='fixed z-10'>
          <Popover.Panel
            className='absolute left-1/2 md:left-0  z-10 w-screen max-w-xs  lg:w-56 
               -translate-x-1/2 md:translate-x-0 transform  md:transform-none 
              bg-gray-200 dark:bg-gray-800 rounded shadow-lg'>
            <div className=' divide-y-2 divide-gray-100 divide-dashed'>
              <div className='flex items-center space-x-2 px-1.5 py-2'>
                <div className='relative w-8 h-8 '>
                  <Image
                    src={user?.picture || logoSrc}
                    layout='fill'
                    objectFit='contain'
                    className='rounded-full'
                    alt='user profile picture'
                  />
                </div>
                <div className='flex flex-col items-start font-medium '>
                  <span>{user?.nickname}</span>
                  <span className='text-xs'>{user?.email}</span>
                </div>
              </div>
              <div className='p-1'>
                <Link href='/api/auth/logout'>
                  <a className='collection-menu-item-btn'>
                    <LogoutIcon className='icon-sm' />
                    <span>Log out</span>
                  </a>
                </Link>
              </div>
            </div>
          </Popover.Panel>
        </div>
      </Transition>
    </Popover>
  );
};

export default SidebarUserPopoverMenu;
