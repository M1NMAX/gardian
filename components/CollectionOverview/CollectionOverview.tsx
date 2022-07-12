import {
  LightningBoltIcon,
  StarIcon as StarIconOutline,
} from '@heroicons/react/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/solid';
import Link from 'next/link';
import React, { FC } from 'react';
import { ICollection } from '../../interfaces';

interface CollectionOverviewProps {
  collection: ICollection;
}

const CollectionOverview: FC<CollectionOverviewProps> = (props) => {
  const { collection } = props;
  const { _id: id, name, isFavourite, properties, items } = collection;

  return (
    <Link href={`/collections/${id}`}>
      <a className='flex flex-col p-1 rounded shadow-md bg-gray-100 dark:bg-gray-800 '>
        <span className=' font-semibold text-lg'>{name}</span>
        <span className='flex space-x-2'>
          {isFavourite ? (
            <StarIconFilled className='icon-xs text-green-500' />
          ) : (
            <StarIconOutline className='icon-xs' />
          )}
          {/* number of item */}
          <span className='mt-0.5 flex items-center space-x-0.5'>
            <LightningBoltIcon className='w-4 h-4' />
            <span className='text-xs font-light italic'>{items.length}</span>
          </span>
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
      </a>
    </Link>
  );
};

export default CollectionOverview;
