import { FC, ReactNode } from 'react';
import { Checkbox, Select, Textarea, TextInput } from '@frontstate-ui';
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
        <div className='property-within-drawer'>
          <Checkbox
            label={property.name}
            name={property.name}
            checked={getValue(property.id) === 'true'}
            onChange={(e) =>
              setValue(property.id, e.target.checked ? 'true' : 'false')
            }
            menu={menu}
          />
        </div>
      );
    case PropertyType.SELECT:
      return (
        <div className='property-within-drawer'>
          <Select
            label={property.name}
            name={property.name}
            placeholder='Select your option'
            value={getValue(property.id)}
            onChange={(e) => setValue(property.id, e.target.value)}
            data={property.options.map(({ id, value }) => ({
              label: value,
              value: id,
            }))}
            menu={menu}
          />
        </div>
      );
    case PropertyType.TEXT:
      return (
        <div className='property-within-drawer pb-0'>
          <Textarea
            label={property.name}
            name={property.name}
            value={getValue(property.id)}
            onChange={(e) => setValue(property.id, e.target.value)}
            menu={menu}
            maxRows={4}
            maxLength={200}
          />
        </div>
      );

    default:
      console.log(property.type);
      return (
        <div className='property-within-drawer'>
          <TextInput
            type={property.type}
            label={property.name}
            name={property.name}
            value={getValue(property.id)}
            onChange={(e) => setValue(property.id, e.target.value)}
            menu={menu}
          />
        </div>
      );
  }
};

export default PropertyInput;
