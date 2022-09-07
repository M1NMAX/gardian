import React, { FC } from 'react';
import {
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Property, PropertyType } from '@prisma/client';


interface ItemOverviewPropertyProps {
  property: Property;
  getValue: (pid: string) => string;
}
const ItemOverviewProperty: FC<ItemOverviewPropertyProps> = (props) => {
  const { property, getValue } = props;
  switch (property.type) {
    case PropertyType.CHECKBOX:
      return (
        <span className='flex items-center space-x-0.5'>
          {getValue(property.id) === 'true' ? (
            <CheckIcon className='icon-xxs' />
          ) : (
            <XMarkIcon className='icon-xxs' />
          )}
          <span>{property.name}</span>
        </span>
      );
    case PropertyType.DATE:
      return (
        <span className='flex items-center space-x-0.5'>
          <CalendarIcon className='icon-xs' />
          <span>{new Date(getValue(property.id)).toLocaleDateString()}</span>
        </span>
      );
    case PropertyType.TEXTAREA:
      return (
        <span className='flex items-center space-x-0.5'>
          <ChatBubbleBottomCenterTextIcon className='icon-xs' />
          <span>{property.name}</span>
        </span>
      );
    default:
      return <>{getValue(property.id)}</>;
  }
};

export default ItemOverviewProperty;
