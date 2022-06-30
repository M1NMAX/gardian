import { Menu, Transition } from '@headlessui/react';
import {
  AdjustmentsIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  TableIcon,
  ViewGridIcon,
  ViewListIcon,
} from '@heroicons/react/outline';
import React, { FC, Fragment } from 'react';

interface CollectionAdjustmentMenuProps {
  collectionId?: number | string;
}

const CollectionAdjustmentMenu: FC<CollectionAdjustmentMenuProps> = (props) => {
  const { collectionId } = props;

  return (
    <Menu as='div' className='relative'>
      <Menu.Button className='action-icon-filled-variant rounded'>
        <AdjustmentsIcon className='icon-sm rotate-90' />
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
          className='absolute right-0  z-10 w-52 rounded-l-lg rounded-br-lg rounded-tr dark:border 
          dark:border-black  origin-top-right bg-gray-200  dark:bg-gray-800
           divide-y-2 divide-gray-300 dark:divide-gray-600'>
          <div className='px-2 py-1'>
            <ul>
              <span>View</span>
              <Menu.Item as='li'>
                <button className='collection-menu-item-btn'>
                  <ViewGridIcon className='icon-sm' />
                  <span>Board</span>
                </button>
              </Menu.Item>
              <Menu.Item as='li'>
                <button className='collection-menu-item-btn'>
                  <ViewListIcon className='icon-sm' />
                  <span>List</span>
                </button>
              </Menu.Item>
              <Menu.Item as='li'>
                <button className='collection-menu-item-btn'>
                  <TableIcon className='icon-sm' />
                  <span>Table</span>
                </button>
              </Menu.Item>
            </ul>
          </div>
          <div className='px-2 py-1'>
            <ul>
              <span>Sort by</span>
              <Menu.Item as='li'>
                <button className='collection-menu-item-btn'>
                  <SortAscendingIcon className='icon-sm' />
                  <span>Name</span>
                </button>
              </Menu.Item>
              <Menu.Item as='li'>
                <button className='collection-menu-item-btn'>
                  <SortDescendingIcon className='icon-sm' />
                  <span>Name</span>
                </button>
              </Menu.Item>
              <Menu.Item as='li'>
                <button className='collection-menu-item-btn'>
                  <SortAscendingIcon className='icon-sm' />
                  <span>Creation date</span>
                </button>
              </Menu.Item>
              <Menu.Item as='li'>
                <button className='collection-menu-item-btn'>
                  <SortDescendingIcon className='icon-sm' />
                  <span>Creation date</span>
                </button>
              </Menu.Item>
            </ul>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default CollectionAdjustmentMenu;
