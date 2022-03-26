import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query';
import { CustomItemInterface } from '../../interfaces';

const Customs = () => {
    const router = useRouter();
    const { id: collectionId } = router.query;
    const { data } = useQuery<CustomItemInterface[]>('customItems', async (): Promise<CustomItemInterface[]> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/customItems/collectionId/' + collectionId);
        const response = await res.json();
        return response.data;
    });
    



    return (
        <div>Customs

            <div className='flex flex-col space-y-1'>
                {data?.map((item, idx) => (
                    <div key={idx} className="flex items-center px-2 py-1 rounded-sm border">
                        {item.name} {item.status}
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Customs