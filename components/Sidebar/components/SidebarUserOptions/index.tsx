import React, { Fragment, FC } from 'react';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0';
import { CogIcon, LogoutIcon, SelectorIcon } from '@heroicons/react/outline';
import logoSrc from '../../../../public/logo192.png';
import { Menu, Transition } from '@headlessui/react';

const SidebarUserOptions: FC = ({}) => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Menu>
      <Menu.Button className='space-x-2 btn btn-secondary grow truncate'>
        <div className='relative w-7 h-7'>
          <Image
            src={user?.picture || logoSrc}
            layout='fill'
            objectFit='contain'
            className=' p-2 rounded-full border-2 border-white'
          />
        </div>
        <div className='flex flex-col items-start'>
          <span className='font-medium text-sm'>{user?.nickname}</span>
          <span className='text-xs'>#Pro</span>
        </div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'>
        <div className='fixed z-10'>
          <Menu.Items
            as='ul'
            className='absolute left-4 w-56 origin-top-right bg-gray-200 dark:bg-gray-900 divide-y divide-gray-100
                            rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='px-1 py-1 space-y-1 font-medium '>
              <Menu.Item as='li'>
                <div className='flex items-center space-x-2 px-1.5'>
                  <div className='relative w-10 h-10 '>
                    <Image
                      src={user?.picture || logoSrc}
                      layout='fill'
                      objectFit='contain'
                      className='rounded-full'
                    />
                  </div>
                  <div className='flex flex-col items-start font-medium '>
                    <span>{user?.nickname}</span>
                    <span className='text-xs'>{user?.email}</span>
                  </div>
                </div>
              </Menu.Item>
              <hr className='bg-gray-500 dark:bg-gray-700' />
              <Menu.Item as='li'>
                <a href='/settings' className='btn btn-secondary space-x-1'>
                  <CogIcon className='icon-md' />
                  <span>Settings</span>
                </a>
              </Menu.Item>
              <Menu.Item>
                <a
                  href='/api/auth/logout'
                  className='btn btn-secondary space-x-1'>
                  <LogoutIcon className='icon-md' />
                  <span>Log out</span>
                </a>
              </Menu.Item>
            </div>
          </Menu.Items>
        </div>
      </Transition>
    </Menu>
  );
};

export default SidebarUserOptions;
