import React, { FC } from 'react';
import {
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Property, PropertyType } from '@prisma/client';


interface PropertyOverviewProps {
  property: Property;
  getValue: (pid: string) => string;
}
const PropertyOverview: FC<PropertyOverviewProps> = (props) => {
  const { property, getValue } = props;

  let pro: JSX.Element;
  switch (property.type) {
    case PropertyType.CHECKBOX:
      pro = (
        <span className='flex items-center space-x-0.5'>
          {getValue(property.id) === 'true' ? (
            <CheckIcon className='icon-xxs' />
          ) : (
            <XMarkIcon className='icon-xxs' />
          )}
          <span>{property.name}</span>
        </span>
      );
      break;
    case PropertyType.DATE:
      pro = (
        <span className='flex items-center space-x-0.5'>
          <CalendarIcon className='icon-xs' />
          <span>{new Date(getValue(property.id)).toLocaleDateString()}</span>
        </span>
      );
    case PropertyType.TEXT:
      pro = (
        <span className='flex items-center space-x-0.5'>
          <ChatBubbleBottomCenterTextIcon className='icon-xs' />
          <span>{property.name}</span>
        </span>
      );
      break;
    default:
      pro = <>{getValue(property.id)}</>;
      break;
  }

  return (
    <span className='px-0.5 rounded bg-white dark:bg-gray-600'>{pro}</span>
  );
};

export default PropertyOverview;
