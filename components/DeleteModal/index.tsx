import React, { FC } from 'react';
import Modal from '../Frontstate/Modal';

interface DeleteModalProps {
  open: boolean;
  name: string;
  handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: () => void;
}
const DeleteModal: FC<DeleteModalProps> = ({
  open,
  name,
  handleClose,
  onDelete,
}) => {
  return (
    <Modal
      title='Delete'
      open={open}
      onHide={handleClose}
      size='sm'
      withCloseBtn={false}>
      <>
        <h2>
          Are you sure about delete <span className='italic'>{name}</span>
        </h2>
        <div className='flex flex-col justify-center space-y-2 mt-2'>
          <button onClick={onDelete} className='modal-negative-btn'>
            Delete
          </button>
          <button onClick={handleClose} className='modal-neutral-btn'>
            Cancel
          </button>
        </div>
      </>
    </Modal>
  );
};

export default DeleteModal;
