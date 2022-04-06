import { Popover } from '@headlessui/react';
import { CollectionIcon, PlusIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { updateCustomCollection } from '../../../../../fetch/collections';
import { CollectionInterface, ModalProps, PropertyInCollectionInterface } from '../../../../../interfaces'
import Properties from '../Properties';
import Modal from '../../../../Modal';
import Label from '../../../../Label';




interface EditCustomCollectionModalProps extends ModalProps {
    collection: CollectionInterface
}



const EditCustomCollectionModal: FC<EditCustomCollectionModalProps> = ({ collection, open, handleClose, positiveFeedback, negativeFeedback }) => {
    const router = useRouter();
    const { id: collectionId } = router.query;

    const [name, setName] = useState(collection.name)
    const [description, setDescription] = useState(collection.description);
    const [isDescriptionHidden, setIsDescriptionHidden] = useState(collection.isDescriptionHidden);
    const [properties, setProperties] = useState<PropertyInCollectionInterface[]>(collection.properties)

    const addProperty = (property: PropertyInCollectionInterface): void => {
        setProperties([...properties, property]);
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (collectionId === "" || collectionId == null) return;
        if (name === "" || name == null) return;

        try {
            await updateCustomCollection(collectionId.toString(), name, properties)
            positiveFeedback("Collection updated successfully");
            handleClose();
        } catch (error) {
            negativeFeedback()
        }
    }



    return (
        <Modal title={<Label icon={<CollectionIcon />} text="Collection" />} open={open} onHide={handleClose} size="size">
            <form onSubmit={handleSubmit} className="modal-form">
                <label>
                    <span className='modal-input-label'>Name</span>
                    <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                        placeholder="Item name"
                        className='modal-head-input' />
                </label>

                <label className="flex flex-col w-full mt-1">
                    <span className='modal-input-label'> Description </span>
                    <textarea name='description' value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4} maxLength={200}
                        className='modal-text-area' />
                </label>
                <label className='flex items-center space-x-1 w-fit'>
                    <input type="checkbox"
                        name='taskStatus' checked={isDescriptionHidden}
                        onChange={(e) => setIsDescriptionHidden(e.target.checked)}
                        className='modal-checkbox' />
                    <span className='modal-input-label'> Hide description in collection page</span>
                </label>

                <Properties properties={properties} />

                <Popover className="relative">
                    {({ open, close }) =>
                    (
                        <>
                            <Popover.Button className="btn btn-secondary">
                                <PlusIcon className='icon-xs' />
                                Add Properties
                            </Popover.Button>
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

const propertiesTypes = [
    'text',
    'select'
]



const AddPropertyPopoverContent: FC<AddPropertyInterface> = ({ onAdd, handleClose }) => {
    const [name, setName] = useState("");
    const [selectedPropertyType, setSelectedPropertyType] = useState(propertiesTypes[0]);
    const [values, setValues] = useState("");

    const handleAdd = () => {
        const v = selectedPropertyType === "select" ? values.split("@") : [];
        onAdd({ name, type: selectedPropertyType, values: v })
        handleClose()
    }

    return (
        <div className=' flex flex-col space-y-2'>
            <label>
                <span className='modal-input-label'> Name </span>
                <input type="text" name="name" value={name}
                    onChange={(e) => { setName(e.target.value) }}
                    placeholder="Property name"
                    className='modal-input' />
            </label>
            <label>
                <span className="modal-input-label">Property type</span>
                <select
                    value={selectedPropertyType}
                    onChange={(e) => { setSelectedPropertyType(e.target.value) }}
                    className='modal-input'>
                    {propertiesTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>))}
                </select>
            </label>
            <label className={`${selectedPropertyType === "select" ? 'visible' : 'invisible h-0'} transition-all `}>
                <span className='modal-input-label'> Values</span>
                <input type="text" name="values" value={values} onChange={(e) => { setValues(e.target.value) }}
                    placeholder="Property values"
                    className='modal-input' />
                <p className='text-xs italic' >use @ to separate the values </p>
            </label>
            <div className="flex justify-end space-x-2 mt-2">
                <button onClick={handleClose} type='button' className="modal-neutral-btn">
                    Cancel
                </button>
                <button key={1} type="button" onClick={handleAdd} className="modal-positive-btn">
                    Add
                </button>
            </div>

        </div>
    )
}
