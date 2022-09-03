import { Popover, Transition } from '@headlessui/react';
import { LogoutIcon } from '@heroicons/react/outline';
import React, { Fragment } from 'react';
import Image from 'next/image';
import logoSrc from '../../../public/logo192.png';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

const SidebarUserPopoverMenu = () => {
  const { data: session, status } = useSession();
  console.log(session);

  return (
    <Popover className='relative'>
      <Popover.Button
        className='p-1 rounded bg-gray-200 hover:bg-gray-300
       dark:bg-gray-700 dark:hover:bg-gray-600'>
        {status === 'loading' ? (
          <div
            className='h-6 w-6  animate-pulse rounded-full 
         bg-gray-400 dark:bg-gray-600'></div>
        ) : (
          <div className='relative w-6 h-6'>
            <Image
              src={session?.user?.image || logoSrc}
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
                    src={session?.user?.image || logoSrc}
                    layout='fill'
                    objectFit='contain'
                    className='rounded-full'
                    alt='user profile picture'
                  />
                </div>
                <div className='flex flex-col items-start font-medium '>
                  <span>{session?.user?.name || 'usename'}</span>
                  <span className='text-xs'>
                    {session?.user?.email || 'email@email.com'}
                  </span>
                </div>
              </div>
              <div className='p-1'>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className='menu-item-btn'>
                  <LogoutIcon className='icon-sm' />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </Popover.Panel>
        </div>
      </Transition>
    </Popover>
  );
};

export default SidebarUserPopoverMenu;
