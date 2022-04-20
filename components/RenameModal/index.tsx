import React, { FC, useState } from 'react';
import Modal from '../Frontstate/Modal';

interface RenameModalProps {
    name: string,
    open: boolean,
    handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void,
    onRename: (name: string) => void
}

const RenameModal: FC<RenameModalProps> = ({ name, open, handleClose, onRename }) => {
    const [newName, setNewName] = useState(name);
    return (
        <Modal title="Rename" open={open} onHide={handleClose} >
            <>

                <input value={newName} onChange={(e) => setNewName(e.target.value)}
                    placeholder="New name"
                    className='modal-input' />
                <div className="flex justify-end space-x-2 mt-2">
                    <button onClick={handleClose} className="modal-neutral-btn">
                        Cancel
                    </button>
                    <button onClick={() => { onRename(newName) }} className="modal-positive-btn">
                        Rename
                    </button>
                </div>
            </>
        </Modal>
    )
}

export default RenameModal