import React, { FC, ReactNode } from 'react';
import { MenuAlt2Icon } from '@heroicons/react/outline';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { ActionIcon } from '../frontstate-ui';

interface HeaderProps {
  children: ReactNode;
}

const Header: FC<HeaderProps> = (props) => {
  const { children } = props;

  const [sidebar, setSidebar] = useRecoilState(sidebarState);
  const openSidebar = () => setSidebar(true);

  return (
    <div className='sticky top-0 pt-2 px-4 bg-white dark:bg-gray-900 dark:text-white'>
      <div className='space-y-1 pb-1 border-dotted border-b-2 border-gray-200 dark:border-gray-700'>
        {/* Menu btn  */}
        {!sidebar && (
          <ActionIcon onClick={openSidebar}>
            <MenuAlt2Icon />
          </ActionIcon>
        )}

        {/* Title   */}
        <div className='flex items-center space-x-1'>{children}</div>
      </div>
    </div>
  );
};

export default Header;
