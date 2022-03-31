import { Listbox, Popover, Transition } from '@headlessui/react';
import { CheckIcon, CollectionIcon, SelectorIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { updateCollection } from '../../fetch/collections';
import { CollectionInterface, ModalProps, PropertyInCollectionInterface } from '../../interfaces'
import Badge from '../Badge';
import CollectionProperties from '../CollectionProperties';
import Modal from '../Modal';


const propertiesTypes = [
    { name: 'text' },
    { name: 'select' },
]

const BadgeWithIcon = () => {
    return (
        <span className='flex space-x-1'>
            <CollectionIcon className='icon-sm' />
            <span>Collection</span>
        </span>
    )
}


const EditCustomCollectionModal: FC<ModalProps> = ({ open, handleClose, positiveFeedback, negativeFeedback }) => {
    const router = useRouter();
    const { id: collectionId } = router.query;

    const [name, setName] = useState("")
    const [properties, setProperties] = useState<PropertyInCollectionInterface[]>([])


    const { data } = useQuery<CollectionInterface>('customCollection', async (): Promise<CollectionInterface> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/collections/' + collectionId);
        const response = await res.json();
        return response.data;
    });

    useEffect(() => {
        if (data) {
            setName(data.name)
            setProperties(data.properties)
        }
    }, [collectionId, data])

    const addProperty = (property: PropertyInCollectionInterface): void => {
        setProperties([...properties, property]);
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (collectionId === "" || collectionId == null) return;
        if (name === "" || name == null) return;

        try {
            await updateCollection(collectionId.toString(), name, properties)
            positiveFeedback("Custom Item created successfully");
            handleClose();
        } catch (error) {
            negativeFeedback()
        }
    }



    return (
        <Modal title={<BadgeWithIcon />} open={open} onHide={handleClose} size="size">
            <form onSubmit={handleSubmit}>

                <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                    placeholder="Item name"
                    className='modal-head-input' />


                <CollectionProperties properties={properties} />

                <Popover className="relative">
                    {({ open, close }) =>
                    (
                        <>
                            <Popover.Button className="btn btn-secondary">Add Properties</Popover.Button>
                            <Popover.Panel className="absolute bottom-6 z-10 w-72 p-2 shadow-lg  bg-white dark:bg-gray-900 rounded border ">
                                <AddPropertyPopoverContent onAdd={addProperty} handleClose={close} />
                            </Popover.Panel>
                        </>
                    )}

                </Popover>
                <div className="flex justify-end space-x-2 mt-2">
                    <button onClick={handleClose} className="modal-neutral-btn">
                        Cancel
                    </button>
                    <button type="submit" className="modal-positive-btn">
                        Update
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default EditCustomCollectionModal

interface AddPropertyInterface {
    onAdd: (property: PropertyInCollectionInterface) => void,
    handleClose: () => void
}


const AddPropertyPopoverContent: FC<AddPropertyInterface> = ({ onAdd, handleClose }) => {
    const [name, setName] = useState("");
    const [selectedPropertyType, setSelectedPropertyType] = useState(propertiesTypes[0].name);
    const [values, setValues] = useState("");

    const handleAdd = () => {
        const v = selectedPropertyType === "select" ? values.split("@") : [];
        onAdd({ name, type: selectedPropertyType, values: v })
        handleClose()
    }

    return (
        <div className='flex flex-col space-y-2'>
            <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                placeholder="Property name"
                className='modal-input' />
            <div>
                <span className="w-full">Property type</span>
                <Listbox value={selectedPropertyType} onChange={setSelectedPropertyType}>
                    <div className="relative mt-1">
                        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left dark:text-black 
                        bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 
                            focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 
                            focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                            <span className="block truncate first-letter:uppercase">{selectedPropertyType}</span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <SelectorIcon className="icon-sm text-gray-500 dark:text-gray-200" aria-hidden="true" />
                            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-gray-50 dark:bg-gray-700 
                         rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {propertiesTypes.map((type, idx) =>
                                    <Listbox.Option key={idx} className={({
                                        active
                                    }) => `cursor-default select-none relative py-2 pl-10 pr-4 dark:text-white ${active ? ' bg-primary-bright' : ''}`} value={type.name}>
                                        {({
                                            selected
                                        }) => <>
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                    {type.name}
                                                </span>
                                                {selected ? <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                    <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                </span> : null}
                                            </>}
                                    </Listbox.Option>)}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
            <label className={`${selectedPropertyType === "select" ? 'visible' : 'invisible h-0'} transition-all `}>
                <span className='w-full'> Values</span>
                <input type="text" name="values" value={values} onChange={(e) => { setValues(e.target.value) }}
                    placeholder="Property values"
                    className='modal-input' />
                <p className='text-xs italic' >use @ to separate the values </p>
            </label>
            <div className="flex justify-end space-x-2 mt-2">
                <button className="modal-neutral-btn">
                    Cancel
                </button>
                <button key={1} type="button" onClick={handleAdd} className="modal-positive-btn">
                    Add
                </button>
            </div>

        </div>
    )
}
