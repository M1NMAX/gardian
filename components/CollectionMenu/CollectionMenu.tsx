import { Menu, Transition } from '@headlessui/react';
import {
  DotsVerticalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import React, { FC, Fragment } from 'react';

interface CollectionMenuProps {
  onClickNewItem: () => void;
  onClickRename: () => void;
  onClickDelete: () => void;
}

const CollectionMenu: FC<CollectionMenuProps> = (props) => {
  const { onClickRename, onClickNewItem, onClickDelete } = props;

  return (
    <Menu as='div' className='relative'>
      <Menu.Button className='action-icon-filled-variant rounded'>
        <DotsVerticalIcon className='icon-sm' />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'>
        <Menu.Items
          as='ul'
          className='absolute right-0  z-10 w-52 p-1 rounded-l-lg rounded-br-lg rounded-tr dark:border dark:border-black  origin-top-right bg-gray-200  dark:bg-gray-800'>
          <Menu.Item as='li'>
            <button
              onClick={onClickNewItem}
              className='collection-menu-item-btn'>
              <PlusIcon className='icon-sm' />
              <span>New Item</span>
            </button>
          </Menu.Item>
          <Menu.Item as='li'>
            <button
              onClick={onClickRename}
              className='collection-menu-item-btn'>
              <PencilIcon className='icon-sm' />
              <span>Rename</span>
            </button>
          </Menu.Item>

          <Menu.Item>
            <button
              onClick={onClickDelete}
              className='collection-menu-item-btn'>
              <TrashIcon className='icon-sm' />
              <span> Delete </span>
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default CollectionMenu;
