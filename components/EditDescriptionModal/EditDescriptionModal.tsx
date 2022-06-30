import { CheckIcon } from '@heroicons/react/outline';
import React, { FC, useState } from 'react';
import Modal from '../Frontstate/Modal';

interface EditDescriptionModalProps {
  description: string;
  open: boolean;
  handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void;
  onSave: (value: string) => void;
}
const EditDescriptionModal: FC<EditDescriptionModalProps> = (props) => {
  const { description, open, handleClose, onSave } = props;
  const [currDescription, setCurrDescription] = useState<string>(description);
  return (
    <Modal title='Description' open={open} onHide={handleClose} size='xl'>
      <div className='space-y-1'>
        <button
          onClick={() => onSave(currDescription)}
          className='btn btn-primary'>
          <CheckIcon className='icon-sm' />
          <span>Save</span>
        </button>

        <textarea
          name='description'
          value={currDescription}
          onChange={(e) => setCurrDescription(e.target.value)}
          rows={12}
          className='modal-text-area'
        />
      </div>
    </Modal>
  );
};

export default EditDescriptionModal;
