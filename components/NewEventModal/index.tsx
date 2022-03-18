import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { NewEventModalProps } from '../../interfaces';
import Modal from '../Modal';


const NewEventModal: FC<NewEventModalProps> = ({ open, handleClose, positiveFeedback, negativeFeedback }) => {

    const router = useRouter();
    const { id } = router.query;

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");


    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (id === "" || id == null || name === "" || name == null
            || date === "" || date == null || time === "" || time == null) return

        try {


            setName("");
            setDate("");
            setTime("");
            setNote("")
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
                    <p className='text-sm'> Note about the event ({note.length}/200)</p>
                    <textarea name='miniNote' value={note} onChange={(e) => setNote(e.target.value)}
                        rows={4} maxLength={200}
                        className='resize-none rounded border border-black bg-gray-50 dark:bg-gray-700' />
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