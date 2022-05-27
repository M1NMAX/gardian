import Link from 'next/link';
import React, { FC } from 'react';
import { ICollection } from '../../interfaces';

interface CollectionOverviewProps {
  collection: ICollection;
}

const CollectionOverview: FC<CollectionOverviewProps> = (props) => {
  const { collection } = props;

  return (
    <Link href={`/collections/${collection._id}`}>
      <a className='flex flex-col p-1 rounded shadow-md bg-gray-100 dark:bg-gray-800 hover:scale-105 '>
        <span className=' font-semibold text-lg'>{collection.name}</span>
        <span className='text-xs font-light italic'>
          {collection.updatedAt
            ? new Date(collection.updatedAt).toDateString()
            : 'Loading'}
        </span>
      </a>
    </Link>
  );
};

export default CollectionOverview;
