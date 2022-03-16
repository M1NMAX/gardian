import Link from 'next/link';
import React, { FC } from 'react';
import { CollectionInterface } from '../../interfaces';

interface CollectionProps {
    collection: CollectionInterface,
}

const Collecion: FC<CollectionProps> = ({ collection }) => {
    return (
        <div className='flex flex-col p-2  text-xl shadow-md border
            rounded-sm bg-white dark:bg-gray-900'>
            <Link href={`/collections/${collection._id}`}>
                <a className='font-semibold text-lg'>
                    {collection.name}
                </a>
            </Link>
            <span className='text-sm font-light'>
                Last modification:
                {collection.updatedAt ? new Date(collection.updatedAt).toLocaleString() : 'Loading'}
            </span>
        </div>
    )
}

export default Collecion