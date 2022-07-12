import Link from 'next/link';
import React, { FC } from 'react';

interface SidebarLinkProps {
  icon: JSX.Element;
  text: string;
  url: string;
  active?: boolean;
}

const SidebarLink: FC<SidebarLinkProps> = ({ icon, text, url, active }) => {
  return (
    <Link href={url}>
      <a
        className={`${
          active &&
          ' border-r-2 border-primary-bright bg-gray-300 dark:bg-gray-600  '
        } flex items-center w-full h-8 space-x-1  px-2  hover:bg-gray-300 dark:hover:bg-gray-600`}>
        <span className='icon-sm'>{icon}</span>
        <span>{text}</span>
      </a>
    </Link>
  );
};
export default SidebarLink;
