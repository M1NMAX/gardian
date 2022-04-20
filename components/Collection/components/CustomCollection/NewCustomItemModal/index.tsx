import React, { FC, useState } from 'react';
import Modal from '../../../../Frontstate/Modal';
import { CollectionInterface, ModalProps, PropertyInCollectionInterface, PropertyInItemInterface } from '../../../../../interfaces';
import { createCustomItem } from '../../../../../fetch/customItems';
import { useRouter } from 'next/router';
interface NewCustomItemModalProps extends ModalProps {
    collection: CollectionInterface
}


const NewCustomItemModal: FC<NewCustomItemModalProps> = ({ collection, open, handleClose, positiveFeedback, negativeFeedback }) => {
    const router = useRouter();
    const { id: collectionId } = router.query;

    const [name, setName] = useState("");
    const [collectionProperties] = useState<PropertyInCollectionInterface[]>(collection.properties)
    const [itemProperties, setItemProperties] = useState<PropertyInItemInterface[]>(collection.properties.map<PropertyInItemInterface>((property => ({
        _id: property._id,
        name: property.name,
        value: ""
    }))))

    const getValueByKey = (id?: string): string => (
        itemProperties.filter(property => (
            property._id?.toString() === id
        ))[0].value
    )

    const setValueByKey = (value: string, id?: string): void => {
        setItemProperties(itemProperties.map(property =>
            property._id?.toString() === id ?
                { ...property, value } : property))
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (collectionId === "" || collectionId == null) return;
        if (name === "" || name == null) return;

        try {
            await createCustomItem(collectionId.toString(), name, itemProperties);
            positiveFeedback("Custom Item created successfully");
            handleClose();
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

                <div className='flex flex-col'>
                    {collectionProperties.map((property) => (
                        <label key={property._id} className="block">
                            <span className='w-full'>
                                {property.name}
                            </span>


                            {property.type === "text" ?
                                <input type="text" name={property.name}
                                    value={getValueByKey(property._id?.toString())}
                                    onChange={(e) => setValueByKey(e.target.value, property._id?.toString())}
                                    className='modal-input' />
                                :
                                <select value={getValueByKey(property._id?.toString())}
                                    onChange={(e) => { setValueByKey(e.target.value, property._id?.toString()) }}
                                    className='modal-input'>
                                    <option selected>Select one option</option>
                                    {property.values.map((value, idx) => (
                                        <option key={idx} value={value}>{value}</option>))}
                                </select>
                            }

                        </label>
                    ))}
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