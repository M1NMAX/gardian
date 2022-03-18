import React, { FC, useState } from 'react';
import Modal from '../Modal';
import { NewDocumentModalProps } from '../../interfaces';
import { BellIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/outline';
import IconBtn from '../IconBtn';

const NewToDoModal: FC<NewDocumentModalProps> = ({ open, handleClose }) => {
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (name === "" || name == null) return
        alert(name)
    }


    return (
        <Modal title="New ToDo" open={open} onHide={handleClose} >
            <form onSubmit={handleSubmit} className="space-y-2">
                <label className="block">
                    <span className="w-full">Name</span>
                    <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                        placeholder="ToDo name"
                        className='modal-input' />
                </label>
                <div className='flex items-center space-x-2'>
                    <IconBtn icon={<CheckCircleIcon />}  />
                    <IconBtn icon={<CalendarIcon />} />
                    <IconBtn icon={<BellIcon />} />
                </div>

                <div className="flex justify-end space-x-2">
                    <button onClick={handleClose} className="modal-neutral-btn">
                        Cancel
                    </button>
                    <button  className="modal-positive-btn">
                        Create
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default NewToDoModal;