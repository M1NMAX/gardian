import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import Modal from '../Modal';
import { ModalProps } from '../../interfaces';
import { createEvent } from '../../fetch/events';
import { BadgeCheckIcon, BellIcon } from '@heroicons/react/outline';


const NewEventModal: FC<ModalProps> = ({ open, handleClose, positiveFeedback, negativeFeedback }) => {

    const router = useRouter();
    const { id } = router.query;

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [reminder, setReminder] = useState(false);


    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (id === "" || id == null) return;
        if (name === "" || name == null || date === "" || date == null) return;

        try {
            await createEvent(id.toString(), name, date, time, description, reminder);
            handleClose();
            positiveFeedback("Event created successfully")
        } catch (error) {
            handleClose()
            negativeFeedback()

        }
    }

    return (
        <Modal title="New Event" open={open} onHide={handleClose} >
            <form>

                <label className="block">
                    <span className="w-full">Name</span>
                    <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                        placeholder="Event name"
                        className='modal-input' />
                </label>

                <div className='flex space-x-1'>
                    <label className="flex flex-col w-full mt-1">
                        <p className="text-sm" > Event date</p>
                        <input type="date" name="date" value={date} onChange={(e) => { setDate(e.target.value) }}
                            className="w-full h-10 p-3 rounded  border border-black bg-gray-50 dark:bg-gray-700" />
                    </label>

                    <label className="flex flex-col w-full mt-1">
                        <p className="text-sm" > Event time</p>
                        <input type="time" name="date" value={time} onChange={(e) => { setTime(e.target.value) }}
                            className="w-full h-10 p-3 rounded  border border-black bg-gray-50 dark:bg-gray-700" />
                    </label>

                </div>

                <label className="flex flex-col w-full mt-1">
                    <p className='text-sm'> Description ({description.length}/200)</p>
                    <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)}
                        rows={4} maxLength={200}
                        className='resize-none rounded border border-black bg-gray-50 dark:bg-gray-700' />
                </label>

                <button key={1} type="button" className='relative btn btn-secondary' onClick={() => setReminder(!reminder)}>
                    <BellIcon className='icon-md' />
                    {reminder && <BadgeCheckIcon className='absolute -top-1 -right-2 icon-xs text-primary' />}
                </button>


                <div className="flex justify-end space-x-2 mt-2">
                    <button onClick={handleClose} className="modal-neutral-btn">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="modal-positive-btn">
                        Create
                    </button>
                </div>

            </form>
        </Modal>
    )
}

export default NewEventModal