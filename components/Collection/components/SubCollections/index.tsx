import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query';
import { CollectionInterface } from '../../../../interfaces';
import CollectionOverview from '../../../CollectionOverview';

const SubCollections = () => {
    const router = useRouter();
    const { id: collectionId } = router.query;
    const { data } = useQuery<CollectionInterface[]>('subCollections', async (): Promise<CollectionInterface[]> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/collections/collectionId/' + collectionId);
        const response = await res.json();
        return response.data;
    });

    return (
        <div>SubCollections

            <div className='grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-2 max-h-full
                overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
                {data?.map((collection, idx: number) => (
                    <CollectionOverview key={idx} collection={collection} />
                ))}


            </div>
        </div>
    )
}

export default SubCollections