import { CollectionIcon } from '@heroicons/react/outline';
import React, { FC, useState } from 'react';
import { createGroup } from '../../fetch/group';
import { ModalProps } from '../../interfaces';
import Modal from '../Frontstate/Modal';
import Label from '../Label';

const CreateGroupModal: FC<ModalProps> = (props) => {
  const { open, handleClose, positiveFeedback, negativeFeedback } = props;

  const [name, setName] = useState('');
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      createGroup(name);
      positiveFeedback('Group created');
      handleClose();
    } catch (error) {
      negativeFeedback();
    }
  };

  return (
    <Modal
      title={<Label icon={<CollectionIcon />} text='New collection' />}
      open={open}
      onHide={handleClose}>
      <form onSubmit={handleSubmit} className='modal-form'>
        <label>
          <span className='modal-input-label'>Name</span>
          <input
            type='text'
            name='name'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder='Collection name'
            className='modal-input'
          />
        </label>
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

export default CreateGroupModal;
