import { BadgeCheckIcon, BellIcon, CalendarIcon } from '@heroicons/react/outline'
import React, { FC, useState } from 'react'
import { updateEvent } from '../../../../../fetch/events'
import { EventInterface, ModalProps } from '../../../../../interfaces'
import Label from '../../../../Label'
import Modal from '../../../../Modal'

interface EditEventModalProps extends ModalProps {
    event: EventInterface,
}

const EditEventModal: FC<EditEventModalProps> = ({ event, open, handleClose, positiveFeedback, negativeFeedback }) => {
    const [name, setName] = useState(event.name);
    const [date, setDate] = useState(event.date);
    const [time, setTime] = useState(event.time);
    const [description, setDescription] = useState(event.description);
    const [reminder, setReminder] = useState(false);

    const isFill = (value: string): boolean => (
        value === "" || value == null
    )
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!event._id || isFill(name)) return;
        try {
            await updateEvent(event._id.toString(), name, date, time, description, reminder);
            positiveFeedback("Event updated successfully");
            handleClose();
        } catch (error) {
            negativeFeedback();
        }
    }




    return (
        <Modal title={<Label icon={<CalendarIcon />} text="Event" />} open={open} onHide={handleClose}>


            <form onSubmit={handleSubmit}>


                <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                    placeholder="Event name"
                    className='modal-head-input' />

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
                    <p className='text-sm'> Description ({description != null && description.length}/200)</p>
                    <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)}
                        rows={4} maxLength={200}
                        className='resize-none rounded border border-black bg-gray-50 dark:bg-gray-700' />
                </label>

                <button key={1} type="button" className='relative btn btn-secondary' onClick={() => setReminder(!reminder)}>
                    <BellIcon className='icon-md' />
                    {reminder && <BadgeCheckIcon className='absolute -top-1 -right-2 icon-xs text-primary' />}
                </button>
                <div className="flex justify-end space-x-2">
                    <button onClick={handleClose} className="modal-neutral-btn">
                        Cancel
                    </button>
                    <button key={0} type='submit' className="modal-positive-btn">
                        Update
                    </button>
                </div>

            </form>
        </Modal>
    )
}

export default EditEventModal