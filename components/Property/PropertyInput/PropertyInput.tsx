import { FC, ReactNode } from 'react';
import { IProperty } from '../../../interfaces';

interface PropertyInputProps {
  property: IProperty;
  menu: ReactNode;
  getValue: (id: number) => string;
  setValue: (id: number, value: string) => void;
}
const PropertyInput: FC<PropertyInputProps> = (props) => {
  const { property, menu, getValue, setValue } = props;

  if (!property._id) return <></>;

  switch (property.type) {
    case 'checkbox':
      return (
        <label className='flex items-center space-x-2 property-within-drawer'>
          <input
            type='checkbox'
            name={property.name}
            checked={getValue(property._id) === 'true'}
            onChange={(e) => {
              if (!property._id) return;
              setValue(property._id, e.target.checked ? 'true' : 'false');
            }}
            className='modal-checkbox'
          />
          <span>{property.name}</span>
        </label>
      );
    case 'select':
      return (
        <label className='property-within-drawer'>
          <span className='w-full flex items-center justify-between'>
            <span className='grow'> {property.name} </span>
            {menu}
          </span>
          <select
            name={property.name}
            value={getValue(property._id)}
            onChange={(e) => {
              if (!property._id) return;
              setValue(property._id, e.target.value);
            }}
            className='modal-input'>
            <option value='' selected disabled hidden></option>
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
        <label className='property-within-drawer'>
          <span className='w-full'>{property.name}</span>
          <textarea
            name={property.name}
            value={getValue(property._id)}
            onChange={(e) => {
              if (!property._id) return;
              setValue(property._id, e.target.value);
            }}
            rows={4}
            maxLength={200}
            className='modal-text-area'
          />
        </label>
      );

    default:
      return (
        <label className='property-within-drawer'>
          <span className='w-full'>{property.name}</span>
          <input
            type={property.type}
            name={property.name}
            value={getValue(property._id)}
            onChange={(e) => {
              if (!property._id) return;
              setValue(property._id, e.target.value);
            }}
            className='modal-input '
          />
        </label>
      );
  }
};

export default PropertyInput;
