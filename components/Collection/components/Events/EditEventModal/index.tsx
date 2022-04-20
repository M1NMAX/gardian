import { CalendarIcon } from '@heroicons/react/outline'
import React, { FC, useState } from 'react'
import { updateEvent } from '../../../../../fetch/events'
import { EventInterface, ModalProps } from '../../../../../interfaces'
import Label from '../../../../Label'
import Modal from '../../../../Frontstate/Modal'

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
            <form onSubmit={handleSubmit} className="modal-form">
                <label>
                    <span className='modal-input-label'>Name</span>
                    <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                        placeholder="Event name"
                        className='modal-head-input' />
                </label>

                <div className='flex space-x-1'>
                    <label className='basis-1/2'>
                        <span className="modal-input-label" > Event date</span>
                        <input type="date" name="date" value={date}
                            onChange={(e) => { setDate(e.target.value) }}
                            className="modal-input" />
                    </label>

                    <label className='basis-1/2'>
                        <span className="modal-input-label" > Event time</span>
                        <input type="time" name="date" value={time}
                            onChange={(e) => { setTime(e.target.value) }}
                            className="modal-input" />
                    </label>

                </div>
                <label>
                    <input type="checkbox"
                        name='reminder' checked={reminder}
                        onChange={(e) => setReminder(e.target.checked)}
                        className='modal-checkbox' />
                    <span className='modal-input-label' > Reminder</span>
                </label>

                <label className='flex flex-col w-full mt-1'>
                    <span className='modal-input-label'> Description ({description != null && description.length}/200)</span>
                    <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)}
                        rows={4} maxLength={200}
                        className='modal-text-area' />
                </label>

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