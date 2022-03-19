import React, { FC, useEffect, useState } from 'react'
import { BellIcon, CalendarIcon, TrashIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router'
import { useQuery } from 'react-query';
import { TodoInterface } from '../../interfaces';

const Todos = () => {
    const router = useRouter();
    const { id: collectionId } = router.query;

    const { data } = useQuery<TodoInterface[]>('items', async (): Promise<TodoInterface[]> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/todos/collectionId/' + collectionId);
        const response = await res.json();
        return response.data;
    });
    return (
        <div>Todos {collectionId}
            <div className='flex flex-col space-y-2'>
                {data?.map((task, idx) => (
                    <Task key={idx} task={task} />
                ))}
            </div>

        </div>
    )
}

interface TaskProps {
    task: TodoInterface
}

const Task: FC<TaskProps> = ({ task }) => {
    const [taskStatus, setTaskStatus] = useState(false);
    useEffect(() => {
        if (!task.isConcluded) return;
        setTaskStatus(task.isConcluded)
    }, [task])

    const handleCheck = () => {
        setTaskStatus(!taskStatus);
        //TODO: call api
    }

    return (
        <div className='flex justify-between items-start space-x-2 px-2 py-1 rounded-sm border group'>
            <span>
                <input type="checkbox"
                    name='taskStatus' checked={taskStatus} onChange={handleCheck}
                    className='appearance-none  rounded bg-gray-200 dark:bg-gray-700 checked:bg-primary' />
            </span>
            <span className='flex flex-col grow'>
                <span className='flex items-center grow'>
                    {task.name}
                </span>
                <span className='flex space-x-2'>
                    {task.reminder && <span className='flex items-center text-xs'>
                        <BellIcon className='icon-xs' /> tomorrow
                    </span>}
                    {task.conclusionDate != '' && <span className='flex items-center space-x-0.5 text-xs'>
                        <CalendarIcon className='icon-xs' />
                        <span>
                            {task.conclusionDate && new Date(task.conclusionDate).toDateString()}
                        </span>
                    </span>}

                </span>

            </span>
            <button className='md:invisible md:group-hover:visible btn btn-secondary'>
                <TrashIcon className='icon-sm' />
            </button>
        </div>);
}
export default Todos