import React, { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import { IProperty } from '../../../interfaces';
import Modal from '../../Frontstate/Modal';
import { PropertyTypes } from '../../../types';
import { ArrowUpIcon, TrashIcon } from '@heroicons/react/outline';
import ActionIcon from '../../Frontstate/ActionIcon';

const types = [
  'text',
  'textarea',
  'select',
  'checkbox',
  'url',
  'date',
  'number',
];

interface EditPropertyModalProps {
  open: boolean;
  handleClose: (value?: boolean | React.MouseEvent<HTMLButtonElement>) => void;
  property: IProperty;
  onUpdate: (property: IProperty) => void;
}
const EditPropertyModal: FC<EditPropertyModalProps> = (props) => {
  const { open, handleClose, property, onUpdate } = props;

  const [name, setName] = useState(property.name);
  const [selectedType, setSelectedType] = useState(property.type);
  const [values, setValues] = useState<string[]>(property.values);
  const [newValue, setNewValue] = useState('');

  const isPropertyTypes = (t: string): t is PropertyTypes => types.includes(t);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (isPropertyTypes(value)) setSelectedType(value);
  };

  const removeValue = (i: number) => {
    if (i == null) return;
    setValues(values.filter((_, idx) => idx != i));
  };

  const addValue = (v: string) => {
    if (v == null || v == '') return;
    setValues([...values, v]);
    setNewValue('');
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onUpdate({ ...property, name, values, type: selectedType });
    handleClose();
  };

  return (
    <Modal
      title=''
      open={open}
      onHide={handleClose}
      withCloseBtn={false}
      size='sm'>
      <form onSubmit={handleSubmit}>
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

        <div className={`mt-2 ${selectedType !== 'select' && 'hidden'}`}>
          <p>Options</p>
          {values.map((value, idx) => (
            <span
              key={idx}
              className='flex items-center justify-between h-8 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600 group'>
              <div>
                <span className='bg-gray-200 dark:bg-gray-600 rounded-sm px-1'>
                  {idx + 1}
                </span>

                <span className='px-1'>{value}</span>
              </div>
              <ActionIcon
                icon={<TrashIcon />}
                onClick={() => removeValue(idx)}
              />
            </span>
          ))}

          <div className='flex items-center mt-1'>
            <label className='flex flex-col w-full'>
              <span className='modal-input-label'>New option </span>
              <div className='flex space-x-2 w-full'>
                <input
                  name='newValue'
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className='modal-input'
                />

                <ActionIcon
                  icon={<ArrowUpIcon />}
                  onClick={() => addValue(newValue)}
                  variant='filled'
                />
              </div>
            </label>
          </div>
        </div>
        <div className='flex justify-end space-x-2 mt-2'>
          <button
            type='button'
            onClick={handleClose}
            className='modal-neutral-btn'>
            Cancel
          </button>
          <button type='submit' className='modal-positive-btn'>
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPropertyModal;
