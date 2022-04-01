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
        <div>Todos Description
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

        <div className='flex justify-between items-center space-x-2 px-2 py-1 rounded-md border group'>

            <input type="checkbox" name='status'
                checked={taskStatus} onChange={handleCheck}
                className='checkbox-input' />

            <button onClick={openEditTodoModal}
                className='grow text-left p-0'>
                {todo.name}
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