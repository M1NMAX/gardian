import Link from 'next/link';
import React, { FC } from 'react';

interface SidebarBtnProps {
  icon: JSX.Element;
  text: string;
  url: string;
}

const SidebarLink: FC<SidebarBtnProps> = ({ icon, text, url }) => {
  return (
    <Link href={url}>
      <a className='w-full space-x-1 btn btn-secondary'>
        <span className='icon-sm'>{icon}</span>
        <span>{text}</span>
      </a>
    </Link>
  );
};
export default SidebarLink;
