import React, { ChangeEvent, FC, useState } from 'react';
import { IProperty } from '../../../interfaces';
import Modal from '../../Frontstate/Modal';
import { PropertyTypes } from '../../../types';

const types = [
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

  const isPropertyTypes = (t: string): t is PropertyTypes => types.includes(t);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (isPropertyTypes(value)) setSelectedType(value);
  };

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
            onChange={handleSelect}
            className='modal-input first-letter:uppercase'>
            {types.map((type, idx) => (
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
