import React, { FC, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Label, Modal } from '@frontstate-ui';
import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import { createGroup } from '../../services';


interface CreateGroupModalProps {
  open: boolean;
  handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void;
  positiveFeedback: (value: string) => void;
  negativeFeedback: () => void;
}

const CreateGroupModal: FC<CreateGroupModalProps> = (props) => {
  const { open, handleClose, positiveFeedback, negativeFeedback } = props;

  const [name, setName] = useState<string>('');

  const queryClient = useQueryClient();

  const createGroupMutation = useMutation(createGroup, {
    onSuccess: () => {
      queryClient.invalidateQueries(['groups']);
      positiveFeedback('Group created');
    },
    onError: () => {
      negativeFeedback();
    },
    onSettled: () => {
      handleClose();
    },
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    createGroupMutation.mutate(name);
  };

  return (
    <Modal
      title={<Label icon={<SquaresPlusIcon />} text='New Group' />}
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
            placeholder='Group name'
            className='modal-input'
          />
        </label>
        <div className='flex justify-end space-x-2 mt-2'>
          <button onClick={handleClose} className='modal-neutral-btn'>
            Cancel
          </button>
          <button disabled={name.length === 0} className='modal-positive-btn'>
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;
