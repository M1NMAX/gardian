import { MenuAlt1Icon, SelectorIcon } from '@heroicons/react/outline';
import React, { FC } from 'react';
import { IProperty, IItemProperty } from '../../interfaces';
import PropertyMenu from './PropertyMenu';
interface PropertyProps {
  cProperty?: IProperty;
  itemProperty: IItemProperty;
}

const Property: FC<PropertyProps> = (props) => {
  const { cProperty, itemProperty } = props;
  console.log(cProperty);

  const handlePropertyIcon = (type: string) => {
    let result = <></>;
    switch (type) {
      case 'text':
        result = <MenuAlt1Icon className='icon-xs' />;
        break;

      case 'select':
        result = <SelectorIcon className='icon-xs' />;
        break;
    }

    return result;
  };

  if (!cProperty) return <></>;
  return (
    <div className='p-1 rounded border'>
      <span className='flex justify-between'>
        <span className='flex items-center space-x-1 text-sm '>
          {handlePropertyIcon(cProperty.type)}
          <span>{itemProperty.name}</span>
        </span>
        <PropertyMenu />
      </span>
      <p>{itemProperty.value}</p>
    </div>
  );
};

export default Property;
