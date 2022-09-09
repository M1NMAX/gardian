import { FC, ReactNode } from 'react';
import { Textarea } from '@frontstate-ui';
import { Property, PropertyType } from '@prisma/client';


interface PropertyInputProps {
  property: Property;
  menu: ReactNode;
  getValue: (id: string) => string;
  setValue: (id: string, value: string) => void;
}
const PropertyInput: FC<PropertyInputProps> = (props) => {
  const { property, menu, getValue, setValue } = props;

  switch (property.type) {
    case PropertyType.CHECKBOX:
      return (
        <label className='flex items-center  property-within-drawer'>
          <span className='w-full flex items-center space-x-1.5'>
            <input
              type='checkbox'
              name={property.name}
              checked={getValue(property.id) === 'true'}
              onChange={(e) =>
                setValue(property.id, e.target.checked ? 'true' : 'false')
              }
              className='modal-checkbox'
            />
            <span className='grow'>{property.name}</span>
          </span>
          {menu}
        </label>
      );
    case PropertyType.SELECT:
      return (
        <label className='property-within-drawer'>
          <span className='w-full flex items-center justify-between'>
            <span className='grow'> {property.name} </span>
            {menu}
          </span>
          <select
            name={property.name}
            value={getValue(property.id)}
            onChange={(e) => setValue(property.id, e.target.value)}
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
    case PropertyType.TEXTAREA:
      return (
        <Textarea
          label={property.name}
          name={property.name}
          value={getValue(property.id)}
          onChange={(e) => setValue(property.id, e.target.value)}
          menu={menu}
          maxRows={4}
          maxLength={200}
        />
      );

    default:
      return (
        <label className='property-within-drawer'>
          <span className='w-full flex items-center justify-between'>
            <span className='grow'> {property.name} </span>
            {menu}
          </span>
          <input
            type={property.type}
            name={property.name}
            value={getValue(property.id)}
            onChange={(e) => setValue(property.id, e.target.value)}
            className='modal-input'
          />
        </label>
      );
  }
};

export default PropertyInput;
