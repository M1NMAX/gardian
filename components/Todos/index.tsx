import React, { FC, useEffect, useState } from 'react'
import { BellIcon, CalendarIcon, TrashIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router'
import { useQuery } from 'react-query';
import { TodoInterface } from '../../interfaces';
import EditTodoModal from '../EditTodoModal';
import toast from 'react-hot-toast';
import GenericMenu from '../GenericMenu';

const Todos = () => {
    const router = useRouter();
    const { id: collectionId } = router.query;

    const { data } = useQuery<TodoInterface[]>('items', async (): Promise<TodoInterface[]> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/todos/collectionId/' + collectionId);
        const response = await res.json();
        return response.data;
    });
    return (
        <div>Todos
            <div className='flex flex-col space-y-2'>
                {data?.map((todo, idx) => (
                    <Todo key={idx} todo={todo} />
                ))}
            </div>

        </div>
    )
}

interface TaskProps {
    todo: TodoInterface
}

const Todo: FC<TaskProps> = ({ todo }) => {
    const [taskStatus, setTaskStatus] = useState(false);
    useEffect(() => {
        if (!todo.isConcluded) return;
        setTaskStatus(todo.isConcluded)
    }, [todo])

    const handleCheck = () => {
        setTaskStatus(!taskStatus);
        //TODO: call api
    }



    const positiveFeedback = (msg: string) => toast.success(msg);
    const negativeFeedback = () => toast.success("Something went wrong, try later");

    const [editTodoModal, setEditTodoModal] = useState(false);
    const openEditTodoModal = () => setEditTodoModal(true);
    const closeEditTodoModal = () => setEditTodoModal(false);

    return (

        <div className='flex justify-between items-start space-x-2 px-2 py-1 rounded-sm border group'>
            <span>
                <input type="checkbox"
                    name='taskStatus' checked={taskStatus} onChange={handleCheck}
                    className='appearance-none  rounded bg-gray-200 dark:bg-gray-700 checked:bg-primary dark:checked:bg-primary-bright' />
            </span>
            <button onClick={openEditTodoModal}
                className='flex flex-col grow'>
                <span className='flex items-center grow'>
                    {todo.name}
                </span>
                <span className='flex space-x-2'>
                    {todo.reminder && <span className='flex items-center text-xs'>
                        <BellIcon className='icon-xs' /> tomorrow
                    </span>}
                    {todo.conclusionDate != '' && <span className='flex items-center space-x-0.5 text-xs'>
                        <CalendarIcon className='icon-xs' />
                        <span>
                            {todo.conclusionDate && new Date(todo.conclusionDate).toDateString()}
                        </span>
                    </span>}

                </span>

            </button>
            <div className='md:invisible md:group-hover:visible '>
                <GenericMenu onClickRename={() => console.log("hh")} onClickDelete={() => console.log("hh")} />
            </div>
            {editTodoModal && <EditTodoModal todo={todo}
                open={editTodoModal}
                handleClose={closeEditTodoModal}
                positiveFeedback={positiveFeedback}
                negativeFeedback={negativeFeedback} />}
        </div>
    );
}
export default Todos