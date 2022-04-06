import { CollectionIcon } from '@heroicons/react/outline';
import React, { FC, useState } from 'react';
import { updateCollection } from '../../../../fetch/collections';
import { CollectionInterface, ModalProps } from '../../../../interfaces';
import Label from '../../../Label';
import Modal from '../../../Modal';

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
            <form onSubmit={handleSubmit} className='modal-form'>

                <label>
                    <span className='modal-input-label'>Name</span>
                    <input type="text" name="name" value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        placeholder="Collection name"
                        className='modal-head-input' />
                </label>

                <label className="flex flex-col w-full mt-1">
                    <span className='modal-input-label'> Description </span>
                    <textarea name='description' value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Collection description"
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