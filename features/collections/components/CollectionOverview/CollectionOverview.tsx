import Link from 'next/link';
import React, { FC } from 'react';
import { CollectionWItemCount } from '@features/collections/services';
import { Icon } from '@features/Icons';
import { HashtagIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { FolderIcon } from '@heroicons/react/24/solid';


interface CollectionOverviewProps {
  collection: CollectionWItemCount;
  groupName: string;
  isGridView: boolean;
}

const CollectionOverview: FC<CollectionOverviewProps> = (props) => {
  const { collection, groupName, isGridView } = props;
  const { id, icon, name, properties, _count, createdAt } = collection;

  return (
    <Link href={`/collections/${id}`}>
      <a className='flex flex-col p-1 space-y-[1px] rounded shadow-md bg-gray-100 dark:bg-gray-800'>
        <span className={`${isGridView ? 'space-y-[1px]' : 'flex space-1'}`}>
          {/** Collection name */}
          <span className='grow flex items-center space-x-1'>
            <Icon icon={icon} defaultIcon={<FolderIcon />} />
            <span className='grow font-semibold text-lg'>{name}</span>
          </span>

          {/** Extra information */}
          <span className='flex space-x-1.5'>
            {/* number of item */}
            {_count.items !== 0 && ( //Show number of items a collections has if diff zero
              <>
                <span className='flex items-center space-x-0.5'>
                  <HashtagIcon className='icon-xs' />
                  <span>{_count.items}</span>
                </span>
                <span aria-hidden='true'>&middot;</span>
              </>
            )}

            <span className='flex items-center space-x-0.5'>
              <Squares2X2Icon className='icon-xs' />
              <span>{groupName}</span>
            </span>
            <span aria-hidden='true' className='hidden md:block'>
              &middot;
            </span>

            <span className='hidden md:block'>
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </span>
        </span>

        {/**  Properties */}
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
