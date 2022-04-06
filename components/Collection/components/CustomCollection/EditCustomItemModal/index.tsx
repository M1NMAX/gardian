import { AdjustmentsIcon, AnnotationIcon, SelectorIcon } from '@heroicons/react/outline'
import React, { FC, useState } from 'react'
import { updateCustomItem } from '../../../../../fetch/customItems'
import { CollectionInterface, CustomItemInterface, ModalProps, PropertyInCollectionInterface, PropertyInItemInterface } from '../../../../../interfaces'
import Label from '../../../../Label'
import Modal from '../../../../Modal'

interface EditCustomItemProps extends ModalProps {
    collection: CollectionInterface
    item: CustomItemInterface
}

const EditCustomItemModal: FC<EditCustomItemProps> = ({ collection, item, open, handleClose, positiveFeedback, negativeFeedback }) => {
    const [name, setName] = useState(item.name);
    const [itemProperties, setItemProperties] = useState<PropertyInItemInterface[]>(item.properties);
    const [collectionProperties] = useState<PropertyInCollectionInterface[]>(collection.properties);

    const getFirstValueById = (id?: string): string => (
        collectionProperties.filter(property => (
            property._id?.toString() === id
        ))[0].values[0]
    )

    const getValueById = (id?: string): string => {
        const result = itemProperties.filter(property => (
            property._id?.toString() === id
        ))[0];
        if (!result) return "";
        return result.value
    }

    const setValueById = (value: string, id?: string): void => {
        setItemProperties(itemProperties.map(property =>
            property._id?.toString() === id ?
                { ...property, value } : property))
    }


    const isFill = (value: string): boolean => (
        value === "" || value == null
    )

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!item._id || isFill(name)) return;

        try {
            await updateCustomItem(item._id.toString(), name, itemProperties);
            handleClose();
            positiveFeedback("Item updated successfully");
        } catch (error) {
            negativeFeedback()
        }
    }



    return (
        <Modal title={<Label icon={<AdjustmentsIcon />} text="Custom item" />} open={open} onHide={handleClose} size="size">
            <form onSubmit={handleSubmit} className="modal-form">

                <label>
                    <span className='modal-input-label'>Name</span>
                    <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Item name"
                        className='modal-head-input' />

                </label>

                {collectionProperties.map((property) => (

                    <label key={property._id} className="md:flex ">
                        <span className='flex items-center space-x-1 w-28 text-right truncate'>
                            {property.type === "text" ?
                                <AnnotationIcon className='icon-sm' />
                                : <SelectorIcon className='icon-sm' />}
                            <span className='first-letter:uppercase font-medium'>
                                {property.name}
                            </span>
                        </span>


                        {property.type === "text" ?
                            <input type="text" name={property.name}
                                value={getValueById(property._id?.toString())}
                                onChange={(e) => setValueById(e.target.value, property._id?.toString())}
                                className='modal-input' />
                            :
                            <select defaultValue={getFirstValueById(property._id?.toString())}
                                value={getValueById(property._id?.toString())}
                                onChange={(e) => { setValueById(e.target.value, property._id?.toString()) }}
                                className='modal-input'>
                                <option selected>Please select a option</option>
                                {property.values.map((value, idx) => (
                                    <option key={idx} value={value}>{value}</option>))}
                            </select>
                        }
                    </label>
                ))}

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

export default EditCustomItemModal