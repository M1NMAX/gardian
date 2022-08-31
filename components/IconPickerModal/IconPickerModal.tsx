import { SearchIcon } from '@heroicons/react/outline';
import React, { FC, useState } from 'react';
import { Modal } from '../frontstate-ui';

interface IIcon {
  filename: string;
  keywords: string[];
}

// weather-
interface IconPickerModalProps {
  open: boolean;
  handleClose: () => void;
  onClickIcon: (iconFilename: string) => void;
}

const myIcons: IIcon[] = [
  {
    filename: 'weather-cloud-1',
    keywords: ['weather', 'cloud', 'forecast', 'cloudy'],
  },
  {
    filename: 'weather-anemometer-2',
    keywords: ['weather', 'anemometer', 'forecast', 'gauce', 'wind'],
  },
  {
    filename: 'weather-wind-3',
    keywords: ['weather', 'wind', 'turbin', 'water', 'pump'],
  },
];
const IconPickerModal: FC<IconPickerModalProps> = (props) => {
  const { open, handleClose, onClickIcon } = props;

  const [query, setQuery] = useState('');
  const filteredIcons =
    query === ''
      ? myIcons
      : myIcons.filter((icon) =>
          icon.keywords
            .join(' ')
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );
  return (
    <Modal
      title='Change icon'
      open={open}
      onHide={handleClose}
      withCloseBtn={false}>
      <div className='w-full flex flex-col space-y-2'>
        <div className='relative w-full my-2 '>
          <div className='absolute inset-y-0 pl-1 flex items-center pointer-events-none'>
            <SearchIcon className='icon-sm text-gray-900 dark:text-white' />
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
        {filteredIcons.length === 0 && query !== '' ? (
          <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
            Nothing found.
          </div>
        ) : (
          <div className='grid grid-cols-12 gap-2'>
            {filteredIcons.map(({ filename }) => (
              <button
                key={filename}
                onClick={() => onClickIcon(filename)}
                className='flex items-center p-1 rounded bg-gray-200 dark:bg-gray-700
                 hover:bg-green-400 dark:hover:bg-green-600'>
                <img src={`/icons/${filename}.svg`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default IconPickerModal;
