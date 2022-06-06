import { DuplicateIcon, TrashIcon } from '@heroicons/react/outline';
import React, { FC, useState } from 'react';
import { IProperty } from '../../../interfaces';
import Modal from '../../Frontstate/Modal';

const propertyTypes = [
  'text',
  'select',
  'checkbox',
  'url',
  'date',
  'number',
  'multi-select',
  'file',
];

interface EditPropertyModalProps {
  open: boolean;
  handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void;
  property: IProperty;
}
const EditPropertyModal: FC<EditPropertyModalProps> = (props) => {
  const { open, handleClose, property } = props;
  const [name, setName] = useState(property.name);
  const [selectedType, setSelectedType] = useState(property.type);

  return (
    <Modal
      title=''
      open={open}
      onHide={handleClose}
      withCloseBtn={false}
      size='sm'>
      <div>
        <label>
          <span className='modal-input-label'>Name</span>
          <input
            type='text'
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Property name'
            className='modal-input'
          />
        </label>
        <label>
          <span className='modal-input-label'>Property type</span>
          <select
            value={selectedType}
            className='modal-input first-letter:uppercase'>
            {propertyTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
    </Modal>
  );
};

export default EditPropertyModal;
