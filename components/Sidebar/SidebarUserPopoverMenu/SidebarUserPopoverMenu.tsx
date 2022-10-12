import { Dropdown } from 'flowbite-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import logoSrc from '../../../public/logo192.png';


const SidebarUserPopoverMenu = () => {
  const { data: session, status } = useSession();

  return (
    <Dropdown
      label={
        <span className='w-full flex space-x-1.5'>
          <div className='relative icon-sm '>
            <Image
              src={session?.user?.image || logoSrc}
              layout='fill'
              objectFit='contain'
              className='rounded'
              alt='user profile picture'
            />
          </div>
          <span className='grow truncate'>
            {session?.user?.name || 'usename'}
          </span>
        </span>
      }
      arrowIcon={false}
      inline>
      <Dropdown.Header>
        <div className='flex items-center space-x-1'>
          <div className='relative w-8 h-8'>
            <Image
              src={session?.user?.image || logoSrc}
              layout='fill'
              objectFit='contain'
              className='rounded'
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
      </Dropdown.Header>

      <Dropdown.Item icon={Cog6ToothIcon}>Settings</Dropdown.Item>
      <Dropdown.Item
        icon={ArrowRightOnRectangleIcon}
        onClick={() => signOut({ callbackUrl: '/' })}>
        Sign Out
      </Dropdown.Item>
    </Dropdown>
  );
};

export default SidebarUserPopoverMenu;
