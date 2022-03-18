import React, { FC, useState } from 'react';
import Modal from '../Modal';
import { CheckIcon } from '@heroicons/react/outline';
import DocumentStatus from '../DocumentStatus';
import { NewDocumentModalProps } from '../../interfaces';
import IconBtn from '../IconBtn';


const NewDocumentModal: FC<NewDocumentModalProps> = ({ open, handleClose }) => {
    const [name, setName] = useState("");
    const [saved, setSaved] = useState(false)
    const [id, setId] = useState();
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (name === "" || name == null) return

        try {

            setSaved(true)
        } catch (error) {
            setError("Error")
        }

    }


    return (
        <Modal title={<DocumentStatus name={id ? name : 'New document'} isSaved={saved} error={error} />} size="size" open={open} onHide={handleClose} >
            <div className='mt-2 h-100 space-y-1'>
                <div className='flex space-x-1'>
                    <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value); setSaved(false) }}
                        placeholder="Name"
                        className=' grow cursor-default rounded  border border-black bg-gray-50 dark:bg-gray-700 
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white ' />
                    <IconBtn icon={<CheckIcon/>} onClick={handleSubmit}/>
                </div>

            </div>
        </Modal>
    )
}

export default NewDocumentModal