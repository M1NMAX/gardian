import React, { FC, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  Square2StackIcon,
  StarIcon as StarIconOutline,
  TrashIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/24/solid';


interface CollectionMenuProps {
  isFavourite: boolean;
  onClickAddToFavourite: () => void;
  onClickDuplicate: () => void;
  onClickChangeIcon: () => void;
  onClickRename: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  onClickMove: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  onClickDelete: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const CollectionMenu: FC<CollectionMenuProps> = (props) => {
  const {
    isFavourite,
    onClickDelete,
    onClickAddToFavourite,
    onClickDuplicate,
    onClickRename,
    onClickChangeIcon,
    onClickMove,
  } = props;
  return (
    <Menu as='div' className='relative'>
      <Menu.Button
        className='flex items-center p-0.5 rounded 
      hover:bg-gray-300 dark:hover:bg-gray-600'>
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
        <div className='fixed z-10'>
          <Menu.Items
            as='ul'
            className='absolute -right-2.5  -top-2.5 md:right-auto md:left-2.5
             z-10 w-52 p-1  rounded-b-lg rounded-tl-lg md:rounded-tl-none md:rounded-tr-lg
              origin-top-right bg-gray-200 dark:bg-gray-800'>
            <Menu.Item as='li'>
              <button onClick={onClickDelete} className='menu-item-btn'>
                <TrashIcon className='icon-sm' />
                <span> Delete </span>
              </button>
            </Menu.Item>

            <Menu.Item as='li'>
              <button onClick={onClickAddToFavourite} className='menu-item-btn'>
                {isFavourite ? (
                  <StarIconFilled className='icon-sm text-green-500' />
                ) : (
                  <StarIconOutline className='icon-sm' />
                )}

                <span>
                  {isFavourite ? 'Remove from Favourites' : 'Add to Favoutires'}
                </span>
              </button>
            </Menu.Item>

            <Menu.Item as='li'>
              <button onClick={onClickDuplicate} className='menu-item-btn'>
                <Square2StackIcon className='icon-sm' />
                <span>Duplicate</span>
              </button>
            </Menu.Item>

            <Menu.Item as='li'>
              <button onClick={onClickRename} className='menu-item-btn'>
                <PencilIcon className='icon-sm' />
                <span>Rename</span>
              </button>
            </Menu.Item>

            <Menu.Item as='li'>
              <button onClick={onClickChangeIcon} className='menu-item-btn'>
                <Cog6ToothIcon className='icon-sm' />
                <span>Change Icon</span>
              </button>
            </Menu.Item>

            <Menu.Item as='li'>
              <button onClick={onClickMove} className='menu-item-btn'>
                <ArrowUturnRightIcon className='icon-sm' />
                <span>Move to</span>
              </button>
            </Menu.Item>
          </Menu.Items>
        </div>
      </Transition>
    </Menu>
  );
};

export default CollectionMenu;
