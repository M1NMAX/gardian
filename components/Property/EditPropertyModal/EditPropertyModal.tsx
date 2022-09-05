import React, { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import { ArrowUpIcon, TrashIcon } from '@heroicons/react/outline';
import { ActionIcon, Modal } from '@frontstate-ui';
import { Property, PropertyType } from '@prisma/client';
import {
  PROPERTY_CHECKBOX,
  PROPERTY_DATE,
  PROPERTY_NUMBER,
  PROPERTY_SELECT,
  PROPERTY_TEXT,
  PROPERTY_TEXTAREA,
  PROPERTY_URL,
} from '@constants';

const types = [
  PROPERTY_TEXT,
  PROPERTY_TEXTAREA,
  PROPERTY_SELECT,
  PROPERTY_CHECKBOX,
  PROPERTY_URL,
  PROPERTY_DATE,
  PROPERTY_NUMBER,
];

interface EditPropertyModalProps {
  open: boolean;
  property: Property;
  handleClose: () => void;
  onUpdate: (property: Property) => void;
}
const EditPropertyModal: FC<EditPropertyModalProps> = (props) => {
  const { open, handleClose, property, onUpdate } = props;

  const [name, setName] = useState(property.name);
  const [selectedType, setSelectedType] = useState<PropertyType>(property.type);
  const [values, setValues] = useState<string[]>(property.values);
  const [newValue, setNewValue] = useState('');

  const isPropertyTypes = (t: string): t is PropertyType => types.includes(t);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log(types.includes(value));

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
            className='modal-input lowercase first-letter:uppercase'>
            {types.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <div className={`mt-2 ${selectedType !== 'SELECT' && 'hidden'}`}>
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
              <ActionIcon onClick={() => removeValue(idx)}>
                <TrashIcon className='icon-sm' />
              </ActionIcon>
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
                <ActionIcon onClick={() => addValue(newValue)}>
                  <ArrowUpIcon className='icon-sm' />
                </ActionIcon>
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
