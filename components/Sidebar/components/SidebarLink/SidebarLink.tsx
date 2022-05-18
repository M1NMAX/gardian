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
          active && ' bg-primary/90 '
        } w-full space-x-1 btn btn-secondary`}>
        <span className='icon-sm'>{icon}</span>
        <span>{text}</span>
      </a>
    </Link>
  );
};
export default SidebarLink;
