import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import Modal from '../../../../Modal';
import { ModalProps } from '../../../../../interfaces';
import { createEvent } from '../../../../../fetch/events';
import { CalendarIcon } from '@heroicons/react/outline';
import Label from '../../../../Label';


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
        <Modal title={<Label icon={<CalendarIcon />} text="New event" />} open={open} onHide={handleClose} >
            <form className='modal-form'>

                <label>
                    <span className="modal-input-label">Name</span>
                    <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                        placeholder="Event name"
                        className='modal-head-input' />
                </label>

                <div className='flex space-x-1'>
                    <label className="basis-1/2">
                        <span className="modal-input-label" > Event date</span>
                        <input type="date" name="date" value={date} onChange={(e) => { setDate(e.target.value) }}
                            className="modal-input" />
                    </label>

                    <label className="basis-1/2">
                        <span className="modal-input-label" > Event time</span>
                        <input type="time" name="date" value={time} onChange={(e) => { setTime(e.target.value) }}
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

                <label className="flex flex-col w-full mt-1">
                    <span className="modal-input-label"> Description ({description.length}/200)</span>
                    <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)}
                        rows={4} maxLength={200}
                        className='modal-text-area' />
                </label>


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