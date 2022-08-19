import React, { FC } from 'react';
import {
  CollectionIcon,
  HashtagIcon,
  StarIcon as StarIconOutline,
  ViewBoardsIcon,
} from '@heroicons/react/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/solid';
import Link from 'next/link';
import { ICollection } from '../../interfaces';

interface CollectionOverviewProps {
  collection: ICollection;
  groupName: string;
}

const CollectionOverview: FC<CollectionOverviewProps> = (props) => {
  const { collection, groupName } = props;
  const {
    _id: id,
    name,
    isFavourite,
    properties,
    items,
    createdAt,
  } = collection;

  return (
    <Link href={`/collections/${id}`}>
      <a className='flex flex-col p-1 rounded shadow-md bg-gray-100 dark:bg-gray-800 '>
        <span className='flex items-center space-x-1'>
          <CollectionIcon className='icon-xs' />
          <span className='grow font-semibold text-lg'>{name}</span>
          {isFavourite ? (
            <StarIconFilled className='icon-xs text-primary-200' />
          ) : (
            <StarIconOutline className='icon-xs' />
          )}
        </span>

        {/** Collection properties */}
        <span className='w-full grid grid-flow-col auto-cols-max gap-0.5 md:gap-1 text-sm overflow-x-auto scrollbar-none'>
          {properties.map((property, idx) => (
            <span
              key={idx}
              className='text-sm font-semibold px-1 rounded bg-white dark:bg-gray-700 '>
              {property.name}
            </span>
          ))}
          {properties.length === 0 && 'N/A'}
        </span>

        <span className='flex space-x-1.5'>
          {items.length !== 0 && (
            <>
              <span className='flex items-center space-x-0.5'>
                <HashtagIcon className='icon-xs' />
                <span>{items.length}</span>
              </span>
              <span aria-hidden='true'>&middot;</span>
            </>
          )}

          <span className='flex items-center space-x-0.5'>
            <ViewBoardsIcon className='icon-xs' />
            <span>{groupName}</span>
          </span>
          <span aria-hidden='true'>&middot;</span>
          {/* number of item */}

          <span>
            {createdAt ? new Date(createdAt).toLocaleDateString() : 'Loading'}
          </span>
        </span>
      </a>
    </Link>
  );
};

export default CollectionOverview;
