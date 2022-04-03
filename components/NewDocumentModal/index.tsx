import React, { FC, useState } from 'react';
import Modal from '../Modal';
import { CheckIcon } from '@heroicons/react/outline';
import DocumentStatus from '../DocumentStatus';
import { ModalProps } from '../../interfaces';
import ActionIcon from '../ActionIcon';
import { createDocument, updateDocument } from '../../fetch/documents';
import { useRouter } from 'next/router';


const NewDocumentModal: FC<ModalProps> = ({ open, handleClose, positiveFeedback, negativeFeedback }) => {
    const router = useRouter();
    const { id: collectionId } = router.query;

    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [id, setId] = useState<string>()
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (collectionId === "" || collectionId == null) return;
        if (name === "" || name == null || content === "" || content == null) return;

        if (!id) {
            try {
                const document = await createDocument(collectionId.toString(), name, content);
                positiveFeedback("Document created successfully");
                setId(document._id?.toString());
                setSaved(true)
            } catch (error) {
                setError("Error")
            }
        } else {
            try {
                await updateDocument(id, name, content);
                positiveFeedback("Document saved successfully")
                setSaved(true);
            } catch (error) {
                setError("Error")

            }
        }

    }


    return (
        <Modal title={<DocumentStatus name={id ? name : 'New document'} isSaved={saved} error={error} />}
            size="size" open={open} onHide={handleClose} >
            <div className='mt-2 h-100 space-y-1'>
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

            </div>
        </Modal>
    )
}

export default NewDocumentModal