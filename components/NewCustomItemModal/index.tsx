import React, { FC, Fragment, useState } from 'react';
import Modal from '../Modal';
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline';
import { ModalProps } from '../../interfaces';
import { Combobox, Transition } from '@headlessui/react';
import { createCustomItem } from '../../fetch/customItems';
import { useRouter } from 'next/router';


const possibleStatus = [
    { id: 1, name: 'Completed' },
    { id: 2, name: 'In progress' },
    { id: 3, name: 'Doing' },
    { id: 4, name: 'Pending' },
    { id: 5, name: 'Started' },
]

const NewCustomItemModal: FC<ModalProps> = ({ open, handleClose, positiveFeedback, negativeFeedback }) => {
    const router = useRouter();
    const { id: collectionId } = router.query;

    const [name, setName] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(possibleStatus[0]);
    const [extraProperties, setExtraProperties] = useState<{ name: string, value: string }[]>([])
    const [query, setQuery] = useState('')

    const filteredStatus =
        query === ''
            ? possibleStatus
            : possibleStatus.filter((status) =>
                status.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (collectionId === "" || collectionId == null) return;
        if (name === "" || name == null) return;

        console.log(typeof extraProperties)

        try {

            const result = await createCustomItem(collectionId.toString(), name, selectedStatus.name);
            positiveFeedback("Custom Item created successfully");
            handleClose()
            console.log(result)

        } catch (error) {
            negativeFeedback()
        }
    }


    return (
        <Modal title="New item" open={open} onHide={handleClose} >
            <form onSubmit={handleSubmit} className='space-y-2'>
                <label className="block">
                    <span className="w-full">Name</span>
                    <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                        placeholder="Item name"
                        className='modal-input' />
                </label>

                <div className="w-full">
                    <Combobox value={selectedStatus} onChange={setSelectedStatus}>
                        <div className="relative mt-1">
                            <span className="w-full">Status</span>
                            <div className="relative w-full  text-left  rounded border border-black cursor-default
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white 
                             focus-visible:ring-offset-teal-300 focus-visible:ring-offset-2 sm:text-sm overflow-hidden">
                                <Combobox.Input
                                    className="w-full h-10 border-none focus:ring-0 py-2 pl-3 pr-10  bg-gray-50 dark:bg-gray-700"
                                    displayValue={(status: { id: number, name: string }) => status.name}
                                    onChange={(event) => setQuery(event.target.value)}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <SelectorIcon
                                        className="icon-sm text-gray-500 dark:text-gray-200"
                                        aria-hidden="true"
                                    />
                                </Combobox.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => setQuery('')}
                            >
                                <Combobox.Options className=" w-full py-1 mt-1 overflow-auto text-base bg-gray-50 dark:bg-gray-700 
                                rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredStatus.length === 0 && query !== '' ? (
                                        <div className="cursor-default select-none relative py-2 px-4">
                                            Nothing found.
                                        </div>
                                    ) : (
                                        filteredStatus.map((status) => (
                                            <Combobox.Option
                                                key={status.id}
                                                className={({ active }) =>
                                                    `cursor-default select-none relative py-2 pl-10 pr-4 ${active ? 'text-white bg-primary-bright' : ''
                                                    }`
                                                }
                                                value={status}
                                            >
                                                {({ selected, active }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                }`}
                                                        >
                                                            {status.name}
                                                        </span>
                                                        {selected ? (
                                                            <span
                                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                                    }`}
                                                            >
                                                                <CheckIcon className="icon-sm" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Combobox.Option>
                                        ))
                                    )}
                                </Combobox.Options>
                            </Transition>
                        </div>
                    </Combobox>
                </div>

                <div className="flex justify-end space-x-2 mt-2">
                    <button onClick={handleClose} className="modal-neutral-btn">
                        Cancel
                    </button>
                    <button className="modal-positive-btn">
                        Create
                    </button>
                </div>

            </form>
        </Modal>
    )
}

export default NewCustomItemModal;