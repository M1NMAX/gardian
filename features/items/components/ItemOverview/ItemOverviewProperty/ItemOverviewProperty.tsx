import React, { FC } from 'react';
import {
  AnnotationIcon,
  CalendarIcon,
  CheckIcon,
  XIcon,
} from '@heroicons/react/outline';
import { IProperty } from '../../../../../interfaces';

interface ItemOverviewPropertyProps {
  property: IProperty;
  getValue: (id?: string) => string;
}
const ItemOverviewProperty: FC<ItemOverviewPropertyProps> = (props) => {
  const { property, getValue } = props;
  switch (property.type) {
    case 'checkbox':
      return (
        <span className='flex items-center space-x-0.5'>
          {getValue(property._id) === 'true' ? (
            <CheckIcon className='icon-xxs' />
          ) : (
            <XIcon className='icon-xxs' />
          )}
          <span>{property.name}</span>
        </span>
      );
    case 'date':
      return (
        <span className='flex items-center space-x-0.5'>
          <CalendarIcon className='icon-xs' />
          <span>{new Date(getValue(property._id)).toLocaleDateString()}</span>
        </span>
      );
    case 'textarea':
      return (
        <span className='flex items-center space-x-0.5'>
          <AnnotationIcon className='icon-xs' />
          <span>{property.name}</span>
        </span>
      );
    default:
      return <>{getValue(property._id)}</>;
  }
};

export default ItemOverviewProperty;
