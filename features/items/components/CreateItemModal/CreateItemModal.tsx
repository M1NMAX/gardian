import React, { FC, useState } from 'react';
import { IItem, IItemProperty, IProperty } from '../../../../interfaces';
import { Button, Modal } from '../../../../components/frontstate-ui';

interface CreateItemModalProps {
  open: boolean;
  handleClose: () => void;
  onCreateItem: (name: string) => void;
}

const CreateItemModal: FC<CreateItemModalProps> = (props) => {
  const { open, handleClose, onCreateItem } = props;

  const [name, setName] = useState<string>('');

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    onCreateItem(name);
  };

  return (
    <Modal title='New Item' open={open} onHide={handleClose}>
      <form onSubmit={handleSubmit} className='space-y-2'>
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

        <div className='flex justify-end space-x-2 mt-2'>
          <Button onClick={handleClose}>
            <span className='text-lg mx-4'>Cancel</span>
          </Button>
          <Button
            variant='primary-filled'
            isDisabled={name.length === 0}
            type='submit'>
            <span className='text-lg mx-4'>Create</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateItemModal;
