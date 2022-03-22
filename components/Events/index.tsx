import { BellIcon, CalendarIcon, ClockIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query';
import { EventInterface } from '../../interfaces';

const Events = () => {
    const router = useRouter();
    const { id: collectionId } = router.query;
    const { data } = useQuery<EventInterface[]>('events', async (): Promise<EventInterface[]> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/events/collectionId/' + collectionId);
        const response = await res.json();
        return response.data;
    });
    console.log(data)
    return (
        <div>Events

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row gap-2
                 scrollbar-thin scrollbar-thumb-gray-300 
                        dark:scrollbar-thumb-gray-600 overflow-y-scroll'>

                {data?.map((event, idx) => (
                    <div key={idx} className='flex flex-col space-y-1 px-2 py-1 
                    rounded-sm border bg-white dark:bg-gray-900'>
                        <div className='w-full truncate'>
                            {event.name}
                        </div>
                        <span className='flex items-center space-x-0.5 text-sm'>
                            <CalendarIcon className='icon-xs' />
                            <span>
                                {event.date && new Date(event.date).toDateString()}
                            </span>
                        </span>
                        <div className='flex space-x-1'>

                            {event.time != '' &&
                                <span className='flex items-center space-x-0.5 text-sm' >
                                    <ClockIcon className='icon-xs' />
                                    <span>
                                        {event.time}
                                    </span>
                                </span>}
                            {event.reminder && <span className='flex items-center text-xs'>
                                <BellIcon className='icon-xs' />
                            </span>}

                        </div>
                    </div>
                ))}

            </div>
        </div >
    )
}

export default Events