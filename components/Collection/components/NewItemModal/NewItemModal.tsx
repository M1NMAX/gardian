import React, { FC, useState } from 'react';
import { ICollection, ModalProps } from '../../../../interfaces';
import Modal from '../../../Frontstate/Modal';

interface NewItemModalProps extends ModalProps {
  collection: ICollection;
}

const NewItemModal: FC<NewItemModalProps> = (props) => {
  const { open, handleClose, positiveFeedback, negativeFeedback, collection } =
    props;

  const [name, setName] = useState<string>('');

  return (
    <Modal title='New Item' open={open} onHide={handleClose}>
      <form className='space-y-2'>
        <label className='block'>
          <span className='w-full'>Name</span>
          <input
            type='text'
            name='name'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder='Item name'
            className='modal-input'
          />
        </label>

        <div className='flex flex-col'></div>
        <div className='flex justify-end space-x-2 mt-2'>
          <button onClick={handleClose} className='modal-neutral-btn'>
            Cancel
          </button>
          <button className='modal-positive-btn'>Create</button>
        </div>
      </form>
    </Modal>
  );
};

export default NewItemModal;
