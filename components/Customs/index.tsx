import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query';
import { CustomItemInterface } from '../../interfaces';
import Badge from '../Badge';

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
                    <div key={idx} className="flex flex-col px-2 py-1 rounded-sm border">
                        <span>
                            {item.name}
                        </span>
                        <span className='space-x-1' >
                            {item.properties?.map((property, idx) => (
                                <Badge key={idx} text={property.value} variant="primary" />
                            ))}
                        </span>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Customs