import { CheckIcon, DocumentIcon } from '@heroicons/react/outline';
import React, { FC, useState } from 'react'
import { updateDocument } from '../../../../../fetch/documents';
import { DocumentInterface, ModalProps } from '../../../../../interfaces'
import ActionIcon from '../../../../ActionIcon';
import DocumentStatus from '../DocumentStatus';
import Modal from '../../../../Modal';
import Label from '../../../../Label';

interface EditDocumentModalProps extends ModalProps {
    document: DocumentInterface,
}



const EditDocumentModal: FC<EditDocumentModalProps> = ({ document, open, handleClose, positiveFeedback, negativeFeedback }) => {


    const [name, setName] = useState(document.name);
    const [content, setContent] = useState(document.content);
    const [isSaved, setIsSaved] = useState(true)
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!document._id) return;
        if (name === "" || name == null || content === "" || content == null) return;
        try {
            await updateDocument(document._id.toString(), name, content);
            positiveFeedback("Document saved successfully")
            setIsSaved(true);
        } catch (error) {
            setError(true)
        }
    }

    return (
        <Modal title={<Label icon={<DocumentIcon />} text="Document" />}
            size="size" open={open} onHide={handleClose} >
            <form className='mt-2 h-100 space-y-1'>
                <div className='flex space-x-1'>
                    <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value); setIsSaved(false) }}
                        placeholder="Name"
                        className='modal-input' />
                    <ActionIcon icon={<CheckIcon />} variant="primary" onClick={handleSubmit} />
                </div>
                <label className=" flex flex-col">
                    <span className='sr-only'> Document content</span>
                    <textarea name='content' value={content}
                        onChange={(e) => { setContent(e.target.value); setIsSaved(false) }}
                        rows={10}
                        className='modal-text-area' />
                </label>
                <DocumentStatus isSaved={isSaved} isError={error} />

            </form>
        </Modal>
    )
}

export default EditDocumentModal