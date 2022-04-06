import { Menu, Transition } from '@headlessui/react';
import { BellIcon, CalendarIcon, ClockIcon, DotsVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router'
import React, { FC, Fragment } from 'react'
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { deleteEvent, renameEvent } from '../../../../fetch/events';
import useModal from '../../../../hooks/useModal';
import { EventInterface } from '../../../../interfaces';
import DeleteModal from '../../../DeleteModal';
import EditEventModal from './EditEventModal';
import RenameModal from '../../../RenameModal';

const Events = () => {
    const router = useRouter();
    const { id: collectionId } = router.query;
    const { data } = useQuery<EventInterface[]>('events', async (): Promise<EventInterface[]> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/events/collectionId/' + collectionId);
        const response = await res.json();
        return response.data;
    });
    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row gap-2
                 scrollbar-thin scrollbar-thumb-gray-300 
                        dark:scrollbar-thumb-gray-600 overflow-y-scroll'>

            {data?.map((event, idx) => (
                <Event key={idx} event={event} />

            ))}

        </div>
    )
}

interface EventProps {
    event: EventInterface
}

const Event: FC<EventProps> = ({ event }) => {

    const positiveFeedback = (msg: string) => toast.success(msg);
    const negativeFeedback = () => toast.success("Something went wrong, try later");

    const editEventModal = useModal();
    const renameModal = useModal();
    const deleteModal = useModal();


    //Rename Event fuction
    const handleRenameEvent = (name: string): void => {
        if (!event._id) return;
        try {
            renameEvent(event._id.toString(), name);
            renameModal.closeModal();
            positiveFeedback("Event renamed successfully");
        } catch (error) {
            negativeFeedback()
        }
    }

    //Rename Event fuction
    const handleDeleteEvent = () => {
        if (!event._id) return;
        try {
            deleteEvent(event._id.toString());
            deleteModal.closeModal();
            positiveFeedback("Event deleted successfully");
        } catch (error) {
            negativeFeedback();
        }
    }


    return (
        <div className='relative p-1
         rounded-md border bg-white dark:bg-gray-900  group'>
            <button onClick={editEventModal.openModal}
                className='grow flex flex-col space-y-1'>
                <span className='w-3/5 text-left font-medium truncate'>
                    {event.name}
                </span>
                <span className='flex items-center space-x-0.5 text-sm'>
                    <CalendarIcon className='icon-xs' />
                    <span>
                        {event.date && new Date(event.date).toDateString()}
                    </span>
                </span>
                <span className='flex space-x-1'>

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

                </span>
            </button>
            <div className='absolute top-0 right-0 z-10 md:invisible md:group-hover:visible'>
                <Menu as="div" className="relative " >
                    <Menu.Button className="btn btn-secondary">
                        <DotsVerticalIcon className='icon-sm' />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items as="ul" className="absolute  z-10 -right-2 w-fit p-1 rounded border  origin-top-right bg-white dark:bg-gray-900">
                            <Menu.Item>
                                <button onClick={renameModal.openModal}
                                    className='w-full space-x-1 btn btn-secondary'>
                                    <PencilIcon className='icon-sm' />
                                    <span> Rename </span>
                                </button>
                            </Menu.Item>
                            <Menu.Item>
                                <button onClick={deleteModal.openModal}
                                    className='w-full space-x-1 btn btn-secondary'>
                                    <TrashIcon className='icon-sm' />
                                    <span> Delete </span>
                                </button>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>



            {editEventModal.isOpen && <EditEventModal
                event={event}
                open={editEventModal.isOpen}
                handleClose={editEventModal.closeModal}
                positiveFeedback={positiveFeedback}
                negativeFeedback={negativeFeedback} />}

            {renameModal.isOpen && <RenameModal open={renameModal.isOpen}
                handleClose={renameModal.closeModal}
                name={event.name} onRename={handleRenameEvent} />}

            {deleteModal && <DeleteModal open={deleteModal.isOpen}
                handleClose={deleteModal.closeModal}
                name={event.name} onDelete={handleDeleteEvent} />}
        </div>
    )

}

export default Events