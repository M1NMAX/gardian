import React, { FC, useState } from 'react';
import Modal from '../Frontstate/Modal';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { RadioGroup } from '@headlessui/react';
import { ICollection, ModalProps } from '../../interfaces';
import { createCollection } from '../../fetch/collections';
import { CollectionIcon } from '@heroicons/react/outline';
import Label from '../Label';

const NewCollectionModal: FC<ModalProps> = (props) => {
  const { open, handleClose, positiveFeedback, negativeFeedback } = props;
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    let newCollection: ICollection = {
      name,
    };
    try {
      await createCollection(newCollection);
      positiveFeedback('Collection created successfully');
      handleClose();
    } catch (error) {
      console.log(error);
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

export default NewCollectionModal;
