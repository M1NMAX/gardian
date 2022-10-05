import React, { FC, useState } from 'react';
import { Button, Input, Modal } from '@frontstate-ui';


interface RenameModalProps {
  name: string;
  open: boolean;
  handleClose: () => void;
  onRename: (name: string) => void;
}

const RenameModal: FC<RenameModalProps> = (props) => {
  const { name, open, handleClose, onRename } = props;
  const [newName, setNewName] = useState(name);
  return (
    <Modal title='Rename' open={open} onHide={handleClose}>
      <Input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder='New name'
      />
      <div className='flex justify-end space-x-2 mt-2'>
        <Button onClick={handleClose}>
          <span className='text-lg mx-4'>Cancel</span>
        </Button>
        <Button
          onClick={() => onRename(newName)}
          variant='primary-filled'
          isDisabled={newName.length === 0}>
          <span className='text-lg mx-4'> Rename</span>
        </Button>
      </div>
    </Modal>
  );
};

export default RenameModal;
