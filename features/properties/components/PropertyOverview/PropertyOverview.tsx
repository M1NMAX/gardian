import React, { FC } from 'react';
import {
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Color, Property, PropertyType } from '@prisma/client';
import style from './PropertyOverview.module.css';


interface PropertyOverviewProps {
  property: Property;
  getValue: (pid: string) => string;
}
const PropertyOverview: FC<PropertyOverviewProps> = (props) => {
  const { property, getValue } = props;

  const getOptionDetails = (id: string) => {
    const option = property.options.find((opt) => opt.id === id);

    if (option) {
      const { value, color } = option;
      return { value, color };
    }

    return { value: '', color: Color.BW };
  };

  let result: JSX.Element;
  switch (property.type) {
    case PropertyType.CHECKBOX:
      return (
        <span className={style.basic}>
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
        <span className={style.basic}>
          <CalendarIcon className='icon-xs' />
          <span>{new Date(getValue(property.id)).toLocaleDateString()}</span>
        </span>
      );
    case PropertyType.TEXT:
      return (
        <span className={style.basic}>
          <ChatBubbleBottomCenterTextIcon className='icon-xs' />
          <span>{property.name}</span>
        </span>
      );

    case PropertyType.SELECT:
      const { value, color } = getOptionDetails(getValue(property.id));

      return (
        <span className={`${style.basic} ${style[color.toLowerCase()]}`}>
          {value}
        </span>
      );

    default:
      return <span className={style.basic}>{getValue(property.id)}</span>;
  }
};

export default PropertyOverview;
