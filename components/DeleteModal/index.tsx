import React, { FC } from 'react'
import Modal from '../Modal'

interface DeleteModalProps {
    open: boolean,
    name: string,
    handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void,
    onDelete: () => void
}
const DeleteModal: FC<DeleteModalProps> = ({ open, name, handleClose, onDelete }) => {
    return (
        <Modal title="Delete" open={open} onHide={handleClose}>
            <>
                <h2>
                    Are you sure about delete <span className='italic'>{name}</span>
                </h2>
                <div className="flex justify-end space-x-2 mt-2">

                    <button onClick={handleClose} className="modal-neutral-btn">
                        Cancel
                    </button>
                    <button onClick={onDelete} className="modal-positive-btn">
                        Delete
                    </button>
                </div>
            </>
        </Modal>
    )
}

export default DeleteModal