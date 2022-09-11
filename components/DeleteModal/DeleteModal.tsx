import React, { FC, ReactNode } from 'react';
import { Button, Modal } from '../frontstate-ui';


interface DeleteModalProps {
  children: ReactNode;
  open: boolean;
  handleClose: () => void;
  onDelete: () => void;
}
const DeleteModal: FC<DeleteModalProps> = (props) => {
  const { children, open, handleClose, onDelete } = props;
  return (
    <Modal
      title='Delete'
      open={open}
      onHide={handleClose}
      size='sm'
      withCloseBtn={false}>
      {children}
      <div className='flex flex-col justify-center space-y-2 mt-2'>
        <Button onClick={onDelete} variant='danger-filled' full>
          <span className='text-lg'>Delete</span>
        </Button>
        <Button onClick={handleClose} variant='secondary-filled' full>
          <span className='text-lg'>Cancel</span>
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
