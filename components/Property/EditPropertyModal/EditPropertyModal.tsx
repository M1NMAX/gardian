import React, { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import { ActionIcon, Button, Modal, Select, TextInput } from '@frontstate-ui';
import { ArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Property, PropertyType } from '@prisma/client';


const propertyTypes: PropertyType[] = [
  PropertyType.TEXT,
  PropertyType.SELECT,
  PropertyType.CHECKBOX,
  PropertyType.URL,
  PropertyType.DATE,
  PropertyType.NUMBER,
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
  const [selectedType, setSelectedType] = useState(property.type);
  const [values, setValues] = useState<string[]>(property.values);
  const [newValue, setNewValue] = useState('');

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PropertyType;
    setSelectedType(value);
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
    <Modal open={open} onHide={handleClose} withCloseBtn={false} size='sm'>
      <form onSubmit={handleSubmit}>
        <TextInput
          label='Name'
          name='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Property name'
        />

        <Select
          label='Property type'
          value={selectedType}
          onChange={handleSelect}
          data={propertyTypes.map((type) => ({
            label: type.charAt(0) + type.slice(1).toLowerCase(),
            value: type,
          }))}
        />

        <div
          className={`mt-2 ${
            selectedType !== PropertyType.SELECT && 'hidden'
          }`}>
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
                <ActionIcon onClick={() => addValue(newValue)} variant='filled'>
                  <ArrowUpIcon className='icon-sm' />
                </ActionIcon>
              </div>
            </label>
          </div>
        </div>
        <div className='flex justify-end space-x-2 mt-2'>
          <Button onClick={handleClose}>
            <span className='text-lg mx-4'>Cancel</span>
          </Button>
          <Button variant='primary-filled' type='submit'>
            <span className='text-lg mx-4'>Save</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPropertyModal;
