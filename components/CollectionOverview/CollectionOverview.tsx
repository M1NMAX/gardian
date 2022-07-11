import { LightningBoltIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React, { FC } from 'react';
import { ICollection } from '../../interfaces';

interface CollectionOverviewProps {
  collection: ICollection;
}

const CollectionOverview: FC<CollectionOverviewProps> = (props) => {
  const { collection } = props;
  const { _id: id, name, properties, items } = collection;

  return (
    <Link href={`/collections/${id}`}>
      <a className='flex flex-col p-1 rounded shadow-md bg-gray-100 dark:bg-gray-800 '>
        <span className=' font-semibold text-lg'>{name}</span>
        {/* number of item */}
        <span className='mt-0.5 flex items-center space-x-0.5'>
          <LightningBoltIcon className='w-4 h-4' />
          <span className='text-xs font-light italic'>{items.length}</span>
        </span>

        {/** Collection properties */}
        <span className='w-full grid grid-flow-col auto-cols-max gap-0.5 md:gap-1 text-sm overflow-x-auto scrollbar-none'>
          {properties.map((property) => (
            <span className=' text-sm font-semibold px-1 rounded bg-white dark:bg-gray-700 '>
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
