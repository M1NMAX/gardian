import React, { FC, useState } from 'react';
import icons from '@features/Icons/iconList';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Modal } from '../frontstate-ui';


// weather-
interface IconPickerModalProps {
  open: boolean;
  handleClose: () => void;
  onClickIcon: (iconFilename: string) => void;
}

const IconPickerModal: FC<IconPickerModalProps> = (props) => {
  const { open, handleClose, onClickIcon } = props;

  const [query, setQuery] = useState('');

  // use  reduce() to reduce the array down into an object.
  const filteredIcons =
    query === ''
      ? icons
      : Object.keys(icons)
          .filter((key) =>
            icons[key].keywords
              .join(' ')
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, ''))
          )
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: icons[key],
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
          <div className='grid grid-cols-12 gap-2'>
            {Object.keys(filteredIcons).map((key) => (
              <button
                key={key}
                onClick={() => onClickIcon(key)}
                className='relative icon-lg p-1 rounded bg-gray-200 dark:bg-gray-700 
                hover:bg-green-400 dark:hover:bg-green-600'>
                {icons[key].component}
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default IconPickerModal;
