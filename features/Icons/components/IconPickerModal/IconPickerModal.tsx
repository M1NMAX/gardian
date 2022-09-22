import React, { FC, Fragment, useState } from 'react';
import { iconList } from '@features/Icons';
import { Input, Modal } from '@frontstate-ui';
import { Popover, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Color, Icon } from '@prisma/client';
import style from './IconPickerModal.module.css';


interface IconPickerModalProps {
  open: boolean;
  handleClose: () => void;
  onClickIcon: (icon: Icon) => void;
}

//bw: black and white, according to theme
const colors: Color[] = [
  Color.BW,
  Color.RED,
  Color.BLUE,
  Color.GREEN,
  Color.YELLOW,
];

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
      <div className='w-full flex flex-col space-y-2 mt-2'>
        <Input
          name='search'
          placeholder='Search'
          srLabel='Search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<MagnifyingGlassIcon className='icon-sm' />}
        />
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
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => onClickIcon({ name: key, color })}
                          className={`${
                            style[color.toLowerCase()]
                          } icon-md p-0.5 rounded 
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
