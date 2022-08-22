import { ChevronRightIcon, SearchIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { useQuery } from 'react-query';
import { getCollections } from '../../fetch/collections';
import { ICollection } from '../../interfaces';
import { Modal } from '../frontstate-ui';

interface SearchModalProps {
  open: boolean;
  handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void;
  onEnter: () => void;
}

const SearchModal: FC<SearchModalProps> = (props) => {
  const { open, handleClose, onEnter } = props;

  const router = useRouter();

  const [query, setQuery] = useState<string>('');

  const { data: collections } = useQuery<ICollection[]>(
    'searchCollections',
    getCollections
  );

  const filteredCollections =
    query === ''
      ? collections && collections.slice(0, 4)
      : collections &&
        collections.filter((collection) =>
          collection.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  const onClickCollection = (id: string) => {
    router.push('/collections/' + id);
    handleClose();
  };

  return (
    <Modal open={open} onHide={handleClose} title='' withCloseBtn={false}>
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
        {filteredCollections &&
        filteredCollections.length === 0 &&
        query !== '' ? (
          <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
            Nothing found.
          </div>
        ) : (
          filteredCollections &&
          filteredCollections.map(
            ({ _id: id, name }) =>
              id && (
                <button
                  onClick={() => onClickCollection(id)}
                  key={id}
                  className='flex justify-between items-center p-2 rounded 
                    bg-gray-200 dark:bg-gray-700 hover:bg-green-400 dark:hover:bg-green-600'>
                  <span>{name}</span>
                  <ChevronRightIcon className='icon-xs' />
                </button>
              )
          )
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;
