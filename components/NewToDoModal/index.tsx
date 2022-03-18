import React, { FC, useState } from 'react';
import Modal from '../Modal';
import { NewDocumentModalProps } from '../../interfaces';
import { BellIcon, CalendarIcon } from '@heroicons/react/outline';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import DatePicker from "react-datepicker";

const NewToDoModal: FC<NewDocumentModalProps> = ({ open, handleClose }) => {
    const [name, setName] = useState("");
    const [hasReminder, setHasReminder] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [conclusionDate, setConclusionDate] = useState(new Date());
    console.log(conclusionDate)


    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (name === "" || name == null) return
        alert(name)
    }


    return (
        <Modal title="New task" open={open} onHide={handleClose} >
            <form onSubmit={handleSubmit} className="space-y-2">
                <label className="block">
                    <span className="w-full">Name</span>
                    <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                        placeholder="ToDo name"
                        className='modal-input' />
                </label>

                <div className='flex items-start space-x-2'>
                    <button key={1} type="button" className='relative btn btn-secondary' onClick={() => setHasReminder(!hasReminder)}>
                        <BellIcon className='icon-md' />
                        {hasReminder && <BadgeCheckIcon className='absolute -top-1 -right-2 icon-xs text-primary' />}
                    </button>
                    <button key={2} type="button" className='relative btn btn-secondary' onClick={() => setShowCalendar(true)}>
                        <CalendarIcon className='icon-md' />
                    </button>
                    {showCalendar &&
                    <div className={`'flex justify-center'`}>
                        <DatePicker selected={conclusionDate}
                            onChange={(date: Date) => { setConclusionDate(date), setShowCalendar(false) }}
                            inline  dateFormat="yyyy-MM-dd" />
                    </div>
                }
                </div>

               


                <div className="flex justify-end space-x-2">
                    <button onClick={handleClose} className="modal-neutral-btn">
                        Cancel
                    </button>
                    <button key={0} type='submit' className="modal-positive-btn">
                        Create
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default NewToDoModal;