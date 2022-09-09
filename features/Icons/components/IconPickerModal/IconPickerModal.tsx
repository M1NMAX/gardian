import React, { FC, Fragment, useState } from 'react';
import { iconList } from '@features/Icons';
import { Modal } from '@frontstate-ui';
import { Popover, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Icon } from '@prisma/client';
import style from './IconPickerModal.module.css';


// weather-
interface IconPickerModalProps {
  open: boolean;
  handleClose: () => void;
  onClickIcon: (icon: Icon) => void;
}

//bw: black and white according to theme
const variants: string[] = ['bw', 'red', 'green', 'blue', 'yellow'];

const IconPickerModal: FC<IconPickerModalProps> = (props) => {
  const { open, handleClose, onClickIcon } = props;

  const [query, setQuery] = useState('');

  // use  reduce() to reduce the array down into an object.
  const filteredIcons =
    query === ''
      ? iconList
      : Object.keys(iconList)
          .filter((key) =>
            iconList[key].keywords
              .join(' ')
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, ''))
          )
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: iconList[key],
            });
          }, {});

  return (
    <Modal
      title='Change icon'
      open={open}
      onHide={handleClose}
      withCloseBtn={false}>
      <div className='w-full flex flex-col space-y-2'>
        <div className='relative w-full my-2 '>
          <div className='absolute inset-y-0 pl-1 flex items-center pointer-events-none'>
            <MagnifyingGlassIcon className='icon-sm text-gray-900 dark:text-white' />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='pl-8 w-full h-10 text-lg font-medium rounded border-0
             bg-gray-100 dark:bg-gray-800
            focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-primary-200 '
            placeholder='Search'
          />
        </div>
        {Object.keys(filteredIcons).length === 0 && query !== '' ? (
          <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
            Nothing found.
          </div>
        ) : (
          <div className='grid grid-cols-8 md:grid-cols-12 gap-1 md:gap-2'>
            {Object.keys(filteredIcons).map((key) => (
              <Popover className='relative'>
                <Popover.Button
                  className='icon-lg p-0.5 rounded
                hover:bg-gray-200 dark:hover:bg-gray-600'>
                  {iconList[key].component}
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-200'
                  enterFrom='opacity-0 translate-y-1'
                  enterTo='opacity-100 translate-y-0'
                  leave='transition ease-in duration-150'
                  leaveFrom='opacity-100 translate-y-0'
                  leaveTo='opacity-0 translate-y-1'>
                  <Popover.Panel
                    className='absolute left-1/2 bottom-full z-10 mb-2 px-4 sm:px-0
           max-w-fit -translate-x-1/2 transform '>
                    <div
                      className='flex items-center justify-between space-x-1.5
              rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden'>
                      {variants.map((variant) => (
                        <button
                          key={variant}
                          onClick={() => onClickIcon({ name: key, variant })}
                          className={`${style[variant]} icon-md p-0.5 rounded 
                          hover:bg-gray-300 dark:hover:bg-gray-800`}>
                          {iconList[key].component}
                        </button>
                      ))}
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default IconPickerModal;
