import React, { FC, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  Square2StackIcon,
  TrashIcon
} from '@heroicons/react/24/outline';


interface PropertyMenuProps {
  onClickEdit?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  onClickDuplicate?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  onClickDelete?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const PropertyMenu: FC<PropertyMenuProps> = (props) => {
  const { onClickEdit, onClickDuplicate, onClickDelete } = props;
  return (
    <Menu as='div' className='relative'>
      <Menu.Button className='menu-hover-variant'>
        <EllipsisVerticalIcon className='icon-xs' />
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
            <button onClick={onClickEdit} className='menu-item-btn'>
              <PencilSquareIcon className='icon-sm' />
              <span>Edit property</span>
            </button>
          </Menu.Item>

          <Menu.Item as='li'>
            <button onClick={onClickDuplicate} className='menu-item-btn'>
              <Square2StackIcon className='icon-sm' />
              <span>Duplicate property</span>
            </button>
          </Menu.Item>

          <Menu.Item>
            <button onClick={onClickDelete} className='menu-item-btn'>
              <TrashIcon className='icon-sm' />
              <span> Delete property</span>
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default PropertyMenu;
