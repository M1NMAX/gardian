import { CollectionIcon } from '@heroicons/react/outline';
import React, { FC, useState } from 'react';
import { updateCollection } from '../../fetch/collections';
import { CollectionInterface, ModalProps } from '../../interfaces';
import Label from '../Label';
import Modal from '../Modal';

interface EditCollectionModalProps extends ModalProps {
    collection: CollectionInterface
}

const EditCollectionModal: FC<EditCollectionModalProps> = ({ collection, open, handleClose, positiveFeedback, negativeFeedback }) => {
    const [name, setName] = useState(collection.name);
    const [description, setDescription] = useState(collection.description);
    const [isDescriptionHidden, setIsDescriptionHidden] = useState(collection.isDescriptionHidden);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!collection._id) return;
        if (name === "" || name == null) return;

        try {
            await updateCollection(collection._id.toString(), name, description, isDescriptionHidden)
            positiveFeedback("Collection updated successfully");
            handleClose();
        } catch (error) {
            negativeFeedback()
        }
    }

    return (
        <Modal title={<Label icon={<CollectionIcon />} text="Collection" />} open={open} onHide={handleClose} size="size">
            <form onSubmit={handleSubmit} className='space-y-2'>
                <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }}
                    placeholder="Collection name"
                    className='modal-head-input' />

                <label className="flex flex-col w-full mt-1">
                    <span className='text-sm'> Description </span>
                    <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)}
                        rows={4} maxLength={200}
                        className='resize-none rounded border border-black bg-gray-50 dark:bg-gray-700' />
                </label>
                <label className='flex items-center space-x-1 w-fit'>
                    <span className='text-sm'> Hide description</span>
                    <input type="checkbox"
                        name='taskStatus' checked={isDescriptionHidden}
                        onChange={(e) => setIsDescriptionHidden(e.target.checked)}
                        className='w-6 h-6 appearance-none  rounded-sm bg-gray-200 dark:bg-gray-700 
                        checked:bg-primary dark:checked:bg-primary-bright' />
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

export default EditCollectionModal