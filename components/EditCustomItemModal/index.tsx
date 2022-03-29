import React, { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { CustomItemInterface, ModalProps, PropertyInItemInterface } from '../../interfaces'
import Modal from '../Modal'

interface EditCustomItemProps extends ModalProps {
    itemId?: string
}

const EditCustomItemModal: FC<EditCustomItemProps> = ({ open, handleClose, positiveFeedback, negativeFeedback, itemId }) => {

    const [name, setName] = useState("");
    const [properties, setProperties] = useState<PropertyInItemInterface[]>([]);



    const { data } = useQuery<CustomItemInterface>('item', async (): Promise<CustomItemInterface> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/customItems/' + itemId);
        const response = await res.json();
        return response.data;
    });
    console.log(data)

    useEffect(() => {
        if (data) {
            setName(data.name);
            if (data.properties)
                setProperties(data.properties);
        }

    }, [itemId, data]);

    const getValueByKey = (id?: string): string => (
        properties.filter(property => (
            property._id?.toString() === id
        ))[0].value
    )



    const setValueByKey = (value: string, id?: string): void => {
        setProperties(properties.map(property =>
            property._id?.toString() === id ?
                { ...property, value } : property))
    }



    return (
        <Modal title="" open={open} onHide={handleClose} size="size">
            <form>
                <div className='space-y-2'>
                    <label className='input-with-label'>
                        <span className='input-label'> Name</span>
                        <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)}
                            className='modal-input' />
                    </label>

                    {properties.map((property) => (
                        <label key={property._id} className="input-with-label">
                            <span className='input-label'>
                                {property.name}
                            </span>
                            <input type="text" name={property.name}
                                value={getValueByKey(property._id?.toString())}
                                onChange={(e) => setValueByKey(e.target.value, property._id?.toString())}
                                className='modal-input' />
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