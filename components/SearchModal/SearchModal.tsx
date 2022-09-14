import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { getCollections } from '@features/collections';
import { Input, Modal } from '@frontstate-ui';
import { ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';


interface SearchModalProps {
  open: boolean;
  handleClose: () => void;
  onEnter: () => void;
}

const SearchModal: FC<SearchModalProps> = (props) => {
  const { open, handleClose, onEnter } = props;

  const router = useRouter();

  const [query, setQuery] = useState<string>('');

  const { data: collections } = useQuery(['searchCollections'], getCollections);

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
        <Input
          name='search'
          placeholder='Search'
          srLabel='Search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<MagnifyingGlassIcon className='icon-sm' />}
        />
        {filteredCollections &&
        filteredCollections.length === 0 &&
        query !== '' ? (
          <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
            Nothing found.
          </div>
        ) : (
          filteredCollections &&
          filteredCollections.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => onClickCollection(id)}
              className='flex justify-between items-center p-2 rounded bg-gray-200
               dark:bg-gray-700 hover:bg-green-400 dark:hover:bg-green-600'>
              <span>{name}</span>
              <ChevronRightIcon className='icon-xs' />
            </button>
          ))
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;
