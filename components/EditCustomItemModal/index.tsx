import { AdjustmentsIcon, AnnotationIcon, ClockIcon, SelectorIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { updateCustomItem } from '../../fetch/customItems'
import { CollectionInterface, CustomItemInterface, ModalProps, PropertyInCollectionInterface, PropertyInItemInterface } from '../../interfaces'
import Label from '../Label'
import Modal from '../Modal'

interface EditCustomItemProps extends ModalProps {
    itemId?: string
}

const EditCustomItemModal: FC<EditCustomItemProps> = ({ open, handleClose, positiveFeedback, negativeFeedback, itemId }) => {
    const router = useRouter();
    const { id: collectionId } = router.query;
    const [name, setName] = useState("");
    const [itemProperties, setItemProperties] = useState<PropertyInItemInterface[]>([]);
    const [collectionProperties, setCollectionProperties] = useState<PropertyInCollectionInterface[]>([]);



    const { data: item } = useQuery<CustomItemInterface>('item', async (): Promise<CustomItemInterface> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/customItems/' + itemId);
        const response = await res.json();
        return response.data;
    });

    const { data: collection } = useQuery<CollectionInterface>('customCollection', async (): Promise<CollectionInterface> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/collections/' + collectionId);
        const response = await res.json();
        return response.data;
    });

    useEffect(() => {
        if (!collection || !item || !collection.properties || !item.properties) return;
        setName(item.name);
        setCollectionProperties(collection.properties);
        setItemProperties(item.properties);
    }, [itemId, item, collection]);

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
        if (!itemId || isFill(name)) return;

        try {
            await updateCustomItem(itemId, name, itemProperties);
            handleClose();
            positiveFeedback("Item updated successfully");
        } catch (error) {
            negativeFeedback()
        }
    }



    return (
        <Modal title={<Label icon={<AdjustmentsIcon />} text="Custom item" />} open={open} onHide={handleClose} size="size">
            <form onSubmit={handleSubmit}>
                <div className='space-y-2'>
                    <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Item name"
                        className='modal-head-input' />
                    <span className='input-with-label'>
                        <span className='property-label'>
                            <ClockIcon className='icon-sm' />
                            <span>
                                Created
                            </span>
                        </span>
                        <span className='property-readOnly'>
                            {item?.updatedAt ? new Date(item.updatedAt).toLocaleString() :
                                'Loading'
                            }
                        </span>
                    </span>
                    {collectionProperties.map((property) => (
                        <label key={property._id} className="input-with-label">
                            <span className='property-label'>
                                {property.type === "text" ? <AnnotationIcon className='icon-sm' /> : <SelectorIcon className='icon-xs' />}
                                <span className='first-letter:uppercase'>
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
                </div>


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