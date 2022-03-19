import Link from 'next/link';
import React, { FC } from 'react';
import { CollectionOverviewProps } from '../../interfaces';


const Collecion: FC<CollectionOverviewProps> = ({ collection }) => {

    const handleVariantName = (variant: string): string => {
        if (variant !== 'simple') return variant + 's';
        return 'generic items';
    }
    return (
        <div className='flex flex-col p-2  text-xl shadow-md border
            rounded-sm bg-white dark:bg-gray-900'>
            <Link href={`/collections/${collection._id}`}>
                <a className='font-semibold text-lg'>
                    {collection.name}
                </a>
            </Link>
            <span className='w-fit px-1 font-medium text-xs uppercase
            rounded border bg-gray-200  dark:bg-gray-700'>
                {handleVariantName(collection.variant)}
            </span>
            <span className='text-xs font-light italic'>
                {collection.updatedAt ?
                    new Date(collection.updatedAt).toDateString() :
                    'Loading'}
            </span>
        </div>
    )
}

export default Collecion