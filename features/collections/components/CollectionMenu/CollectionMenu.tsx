import { Menu, Transition } from '@headlessui/react';
import {
  DotsVerticalIcon,
  InformationCircleIcon,
  PencilIcon,
  PlusIcon,
  StarIcon as StarIconOutline,
  TrashIcon,
} from '@heroicons/react/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/solid';
import React, { FC, Fragment } from 'react';

interface CollectionMenuProps {
  isFavourite: boolean;
  isDescriptionHidden: boolean;
  onClickNewItem: () => void;
  onClickDesctiption: () => void;
  onClickFavourite: () => void;
  onClickRename: () => void;
  onClickDelete: () => void;
}

const CollectionMenu: FC<CollectionMenuProps> = (props) => {
  const {
    isFavourite,
    isDescriptionHidden,
    onClickRename,
    onClickDesctiption,
    onClickFavourite,
    onClickNewItem,
    onClickDelete,
  } = props;

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
              onClick={onClickDesctiption}
              className='collection-menu-item-btn'>
              <InformationCircleIcon className='icon-sm' />
              <span>{isDescriptionHidden ? 'Show' : 'Hide'} Description</span>
            </button>
          </Menu.Item>

          <Menu.Item as='li'>
            <button
              onClick={onClickFavourite}
              className='collection-menu-item-btn'>
              {isFavourite ? (
                <StarIconFilled className='icon-sm text-green-500' />
              ) : (
                <StarIconOutline className='icon-sm' />
              )}
              <span className='text-left'>
                {isFavourite ? 'Remove from Favourites' : 'Add to Favoutires'}
              </span>
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
