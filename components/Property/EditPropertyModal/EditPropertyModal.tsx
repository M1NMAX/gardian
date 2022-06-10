import React, { ChangeEvent, FC, useState } from 'react';
import { IProperty } from '../../../interfaces';
import Modal from '../../Frontstate/Modal';
import { PropertyTypes } from '../../../types';
import { ArrowUpIcon, TrashIcon } from '@heroicons/react/outline';

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

  return (
    <Modal
      title=''
      open={open}
      onHide={handleClose}
      withCloseBtn={false}
      size='sm'>
      <form>
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

        {values.map((value, idx) => (
          <div
            key={idx}
            className='flex items-center justify-between h-8 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600 group'>
            <div>
              <span className='bg-gray-200 dark:bg-gray-600 rounded-sm px-1'>
                {idx + 1}
              </span>

              <span className='px-1'>{value}</span>
            </div>
            <button
              type='button'
              onClick={() => removeValue(idx)}
              className='rounded-md hover:bg-gray-300 dark:hover:bg-gray-100 hover:text-black block  md:hidden md:group-hover:block'>
              <TrashIcon className='icon-sm' />
            </button>
          </div>
        ))}

        <div>
          <div className='flex items-center mt-1'>
            <label className='flex flex-col w-full'>
              <span className='modal-input-label'>New section name</span>
              <div className='relative w-full'>
                <input
                  name='newValue'
                  value={newValue}
                  onChange={(e) => {
                    setNewValue(e.target.value);
                  }}
                  className='modal-input'
                />
                <button
                  type='button'
                  onClick={() => {
                    addValue(newValue);
                  }}
                  className='absolute right-1 top-1 w-10 h-8  rounded bg-yellow-300 hover:bg-amber-300 dark:text-black'>
                  <ArrowUpIcon className='h-8 w-10' />
                </button>
              </div>
            </label>
          </div>
        </div>
        <div className='flex justify-end space-x-2 mt-2'>
          <button onClick={handleClose} className='modal-neutral-btn'>
            Cancel
          </button>
          <button className='modal-positive-btn'>Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPropertyModal;
