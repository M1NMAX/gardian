import { BadgeCheckIcon, BellIcon, CheckIcon } from '@heroicons/react/outline'
import React, { FC, useState } from 'react'
import { ModalProps, TodoInterface } from '../../interfaces'
import Modal from '../Modal'
import Label from '../Label'


interface EditTodoModalProps extends ModalProps {
    todo: TodoInterface
}

const EditTodoModal: FC<EditTodoModalProps> = ({ todo, open, handleClose, positiveFeedback, negativeFeedback }) => {
    const [name, setName] = useState(todo.name);
    const [isConcluded, setIsConcluded] = useState(todo.isConcluded)
    const [conclusionDate, setConclusionDate] = useState(todo.conclusionDate);
    const [reminder, setReminder] = useState(todo.reminder);

    return (
        <Modal title={<Label icon={<CheckIcon />} text="Todo" />} open={open} onHide={handleClose} >
            <form className='space-y-2'>
                <div className='flex items-center space-x-2'>

                    <input type="checkbox"
                        name='taskStatus' checked={isConcluded} onChange={(e) => setIsConcluded(e.target.checked)}
                        className='checkbox-input' />
                    <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Todo name"
                        className='modal-input' />
                </div>

                <div className='flex items-center space-x-2'>

                    <button key={1} type="button" className='relative btn btn-secondary' onClick={() => setReminder(!reminder)}>
                        <BellIcon className='icon-md' />
                        {reminder && <BadgeCheckIcon className='absolute -top-1 -right-2 icon-xs text-primary' />}
                    </button>
                    <input type='date' name='ConclusionDate' value={conclusionDate}
                        onChange={(e) => setConclusionDate(e.target.value)}
                        className='modal-input' />
                </div>

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

export default EditTodoModal