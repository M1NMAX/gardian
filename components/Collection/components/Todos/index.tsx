import React, { FC, Fragment, useEffect, useState } from 'react'
import { BellIcon, CalendarIcon, ChevronUpIcon, DocumentTextIcon, DotsVerticalIcon, TrashIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router'
import { useQuery } from 'react-query';
import { TodoInterface } from '../../../../interfaces';
import EditTodoModal from './EditTodoModal';
import toast from 'react-hot-toast';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import ActionIcon from '../../../ActionIcon';
import { deleteTodo, updateTodoIsConcluded } from '../../../../fetch/todos';
import useModal from '../../../../hooks/useModal';
import DeleteModal from '../../../DeleteModal';

const Todos = () => {
    const router = useRouter();
    const { id: collectionId } = router.query;

    const { data } = useQuery<TodoInterface[]>('items', async (): Promise<TodoInterface[]> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/todos/collectionId/' + collectionId);
        const response = await res.json();
        return response.data;
    });
    return (
            <div className='flex flex-col space-y-2'>
                {data?.map((todo, idx) => (
                    <Todo key={idx} todo={todo} />
                ))}
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



    const handleCheck = async () => {
        if (!todo._id) return;
        try {
            await updateTodoIsConcluded(todo._id?.toString(), !taskStatus)
            setTaskStatus(!taskStatus);
            positiveFeedback("Saved");
        } catch (error) {
            negativeFeedback()
        }

    }



    const positiveFeedback = (msg: string) => toast.success(msg);
    const negativeFeedback = () => toast.success("Something went wrong, try later");

    //Edit todo Modal
    const { isOpen: editTodoModal, openModal: openEditTodoModal, closeModal: closeEditTodoModal } = useModal();

    //Delete todo Modal
    const { isOpen: deleteTodoModal,
        openModal: openDeleteTodoModal,
        closeModal: closeDeleteTodoModal } = useModal();

    //Delete item fuction
    const handleDeleteDelete = () => {
        if (!todo._id) return;
        try {
            deleteTodo(todo._id.toString());
            closeDeleteTodoModal();
            positiveFeedback("Todo deleted successfully")
        } catch (error) {
            negativeFeedback()
        }
    }


    return (

        <div className='flex justify-between items-start space-x-2 px-2 py-1 rounded-md border group'>
            <label className='pt-1'>
                <span className='sr-only'> Make as concluded </span>
                <input type="checkbox" name='status'
                    checked={taskStatus} onChange={handleCheck}
                    className='checkbox-input' />
            </label>

            <div className='grow'>
                <button onClick={openEditTodoModal}
                    className='w-full text-left'>
                    <span className='text-lg'>
                        {todo.name}
                    </span>
                    <span className='flex space-x-2'>
                        {todo.reminderDate != "" && <span className='flex items-center text-xs'>
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

                {todo.description != "" &&
                    <Disclosure>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex justify-between space-x-0.5 w-fit p-1 text-sm font-medium text-left
                              btn btn-secondary focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                    <DocumentTextIcon className='icon-xs' />
                                    <span>Description</span>
                                    <ChevronUpIcon
                                        className={`${open ? 'transform rotate-180' : ''
                                            } icon-xs`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="text-sm dark:text-white">
                                    {todo.description}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                }


            </div>
            <div className='md:invisible md:group-hover:visible '>
                <Menu as="div" className="relative" >
                    <Menu.Button>
                        <ActionIcon icon={<DotsVerticalIcon />} variant="secondary" />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items as="ul" className="absolute  z-10 -right-2 w-fit p-1 rounded border  origin-top-right bg-white dark:bg-gray-900">
                            <Menu.Item>
                                <button onClick={openDeleteTodoModal}
                                    className='w-full space-x-1 btn btn-secondary'>
                                    <TrashIcon className='icon-sm' />
                                    <span> Delete </span>
                                </button>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            {editTodoModal && <EditTodoModal todo={todo}
                open={editTodoModal}
                handleClose={closeEditTodoModal}
                positiveFeedback={positiveFeedback}
                negativeFeedback={negativeFeedback} />}

            {deleteTodoModal && <DeleteModal open={deleteTodoModal} handleClose={closeDeleteTodoModal}
                name={todo.name} onDelete={handleDeleteDelete} />}
        </div>
    );
}
export default Todos