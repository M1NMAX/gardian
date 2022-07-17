import React, { FC } from 'react';
import { IProperty } from '../../../interfaces';

interface PropertyInputProps {
  property: IProperty;
  getValue: (id?: number) => string;
  setValue: (value: string, id?: number) => void;
}
const PropertyInput: FC<PropertyInputProps> = (props) => {
  const { property, getValue, setValue } = props;

  switch (property.type) {
    case 'checkbox':
      return (
        <label className='flex items-center space-x-2'>
          <input
            type='checkbox'
            name={property.name}
            checked={getValue(property._id) == 'true'}
            onChange={(e) => {
              setValue(e.target.checked ? 'true' : 'false', property._id);
            }}
            className='modal-checkbox'
          />
          <span>{property.name}</span>
        </label>
      );
    case 'select':
      return (
        <label className='block'>
          <span className='w-full'> {property.name}</span>
          <select
            name={property.name}
            value={getValue(property._id)}
            onChange={(e) => setValue(e.target.value, property._id)}
            className='modal-input'>
            <option value='' selected disabled hidden>
              choose one option
            </option>
            {property.values.map((value, idx) => (
              <option key={idx} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      );
    case 'textarea':
      return (
        <label className='block'>
          <span className='w-full'>{property.name}</span>
          <textarea
            name={property.name}
            value={getValue(property._id)}
            onChange={(e) => setValue(e.target.value, property._id)}
            rows={4}
            maxLength={200}
            className='modal-text-area'
          />
        </label>
      );

    default:
      return (
        <label className='block'>
          <span className='w-full'>{property.name}</span>
          <input
            type={property.type}
            name={property.name}
            value={getValue(property._id)}
            onChange={(e) => setValue(e.target.value, property._id)}
            className='modal-input'
          />
        </label>
      );
  }
};

export default PropertyInput;
