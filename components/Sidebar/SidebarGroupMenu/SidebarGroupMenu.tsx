import { Menu, Transition } from '@headlessui/react';
import {
  DotsVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import React, { FC, Fragment } from 'react';

interface SidebarGroupMenuProps {
  showDelete: boolean;
  onClickRename: () => void;
  onClickDelete: () => void;
}

const SidebarGroupMenu: FC<SidebarGroupMenuProps> = (props) => {
  const { showDelete, onClickRename, onClickDelete } = props;
  return (
    <Menu as='div' className='relative'>
      <Menu.Button
        className={`flex items-center p-0.5 rounded hover:bg-gray-300 dark:hover:bg-gray-600`}>
        <DotsVerticalIcon className='icon-xs' />
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
            className='absolute z-10 w-52 p-1 rounded-r-lg rounded-bl-lg rounded-tl   origin-top-right bg-gray-200 dark:bg-gray-800'>
            <Menu.Item as='li'>
              <button
                onClick={onClickRename}
                className='w-full space-x-1 btn btn-secondary'>
                <PencilIcon className='icon-sm' />
                <span>Rename</span>
              </button>
            </Menu.Item>

            {/* Only show delete btn if group empty */}
            {showDelete && (
              <Menu.Item as='li'>
                <button
                  onClick={onClickDelete}
                  className='w-full space-x-1 btn btn-secondary'>
                  <TrashIcon className='icon-sm' />
                  <span> Delete </span>
                </button>
              </Menu.Item>
            )}
          </Menu.Items>
        </div>
      </Transition>
    </Menu>
  );
};

export default SidebarGroupMenu;
