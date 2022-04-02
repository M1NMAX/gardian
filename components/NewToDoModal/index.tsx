import React, { FC, useState } from 'react';
import Modal from '../Modal';
import { ModalProps } from '../../interfaces';
import { BellIcon } from '@heroicons/react/outline';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { createTodo } from '../../fetch/todos';

const NewToDoModal: FC<ModalProps> = ({ open, handleClose, positiveFeedback, negativeFeedback }) => {

    const router = useRouter();
    const { id } = router.query;
    const [name, setName] = useState("");
    const [conclusionDate, setConclusionDate] = useState("");


    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (name === "" || name == null) return;
        if (id === "" || id == null) return;
        try {

            await createTodo(id.toString(), name, conclusionDate);
            positiveFeedback("Task created successfully");
            handleClose();

        } catch (error) {
            negativeFeedback();
        }

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

                <label className='block' >
                    <span className='w-full'> Conclusion date </span>
                    <input type='date' name='ConclusionDate' value={conclusionDate} onChange={(e) => setConclusionDate(e.target.value)} className='modal-input' />
                </label>
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