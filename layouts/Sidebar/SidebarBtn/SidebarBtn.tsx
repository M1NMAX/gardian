import Link from 'next/link';
import React, { FC } from 'react';

interface SidebarBtnProps {
  icon: JSX.Element;
  text: string;
  active: boolean;
  onClick: () => void;
}

const SidebarBtn: FC<SidebarBtnProps> = (props) => {
  const { icon, text, active, onClick } = props;

  return (
    <button
      onClick={onClick}
      className={`${
        active && 'border-r-2 border-primary-100 bg-gray-300 dark:bg-gray-600'
      } flex items-center w-full h-8 space-x-1  px-2  hover:bg-gray-300 dark:hover:bg-gray-600`}>
      <span className='icon-sm'>{icon}</span>
      <span>{text}</span>
    </button>
  );
};
export default SidebarBtn;
