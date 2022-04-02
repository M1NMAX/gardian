import { BadgeCheckIcon, BellIcon, CheckIcon } from '@heroicons/react/outline'
import React, { FC, useState } from 'react'
import { ModalProps, TodoInterface } from '../../interfaces'
import Modal from '../Modal'
import Label from '../Label'
import { updateTodo } from '../../fetch/todos'


interface EditTodoModalProps extends ModalProps {
    todo: TodoInterface
}

const EditTodoModal: FC<EditTodoModalProps> = ({ todo, open, handleClose, positiveFeedback, negativeFeedback }) => {
    const [name, setName] = useState(todo.name);
    const [isConcluded, setIsConcluded] = useState(todo.isConcluded);
    const [conclusionDate, setConclusionDate] = useState(todo.conclusionDate || "");
    const [reminderDate, setReminderDate] = useState(todo.reminderDate || "");
    const [description, setDescription] = useState(todo.description || "");

    const isFill = (value: string): boolean => (
        value === "" || value == null
    )

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!todo._id || isFill(name)) return;
        try {
            await updateTodo(todo._id.toString(), name, isConcluded, conclusionDate, reminderDate, description);
            positiveFeedback("Todo updated successfully");
        } catch (error) {
            negativeFeedback();
        }



    }

    return (
        <Modal title={<Label icon={<CheckIcon />} text="Todo" />} open={open} onHide={handleClose} >
            <form onSubmit={handleSubmit} className='space-y-2'>
                <div className='flex items-center space-x-2'>
                    <input type="checkbox"
                        name='taskStatus' checked={isConcluded} onChange={(e) => setIsConcluded(e.target.checked)}
                        className='w-6 h-6 appearance-none  rounded-full bg-gray-200 dark:bg-gray-700 
                        checked:bg-primary dark:checked:bg-primary-bright' />

                    <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Todo name"
                        className='modal-input' />
                </div>

                <div className='flex items-center space-x-2'>
                    <label>
                        <span className='text-sm'>Conclusion date </span>
                        <input type='date' name='ConclusionDate' value={conclusionDate}
                            onChange={(e) => setConclusionDate(e.target.value)}
                            className='modal-input' />
                    </label>
                    <label>
                        <span className='text-sm'>Reminder date </span>
                        <input type='date' name='ConclusionDate' value={reminderDate}
                            onChange={(e) => setReminderDate(e.target.value)}
                            className='modal-input' />
                    </label>
                </div>

                <label className="flex flex-col w-full mt-1">
                    <span className='text-sm'> Description ({description != null && description.length}/200)</span>
                    <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)}
                        rows={4} maxLength={200}
                        className='resize-none rounded border border-black bg-gray-50 dark:bg-gray-700' />
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

export default EditTodoModal