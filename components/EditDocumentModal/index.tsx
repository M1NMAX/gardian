import { CheckIcon } from '@heroicons/react/outline';
import React, { FC, useState } from 'react'
import { updateDocument } from '../../fetch/documents';
import { DocumentInterface, ModalProps } from '../../interfaces'
import ActionIcon from '../ActionIcon';
import DocumentStatus from '../DocumentStatus';
import Modal from '../Modal';

interface EditDocumentModalProps extends ModalProps {
    document: DocumentInterface,
}

const EditDocumentModal: FC<EditDocumentModalProps> = ({ document, open, handleClose, positiveFeedback, negativeFeedback }) => {


    const [name, setName] = useState(document.name);
    const [content, setContent] = useState(document.content);
    const [saved, setSaved] = useState(true)
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!document._id) return;
        if (name === "" || name == null || content === "" || content == null) return;
        try {
            await updateDocument(document._id.toString(), name, content);
            positiveFeedback("Document saved successfully")
            setSaved(true);
        } catch (error) {
            setError("Error")
        }
    }

    return (
        <Modal title={<DocumentStatus name={name} isSaved={saved} error={error} />}
            size="size" open={open} onHide={handleClose} >
            <form className='mt-2 h-100 space-y-1'>
                <div className='flex space-x-1'>
                    <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value); setSaved(false) }}
                        placeholder="Name"
                        className=' grow cursor-default rounded  border border-black bg-gray-50 dark:bg-gray-700 
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white ' />
                    <ActionIcon icon={<CheckIcon />} variant="primary" onClick={handleSubmit} />
                </div>
                <div className=" flex flex-col">
                    <textarea name='content' value={content} onChange={(e) => setContent(e.target.value)}
                        rows={10}
                        className='resize-none rounded border border-black bg-gray-50 dark:bg-gray-700' />
                </div>

            </form>
        </Modal>
    )
}

export default EditDocumentModal