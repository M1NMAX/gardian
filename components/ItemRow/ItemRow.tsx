import {
  AnnotationIcon,
  CalendarIcon,
  CheckIcon,
  XIcon,
} from '@heroicons/react/outline';
import React, { FC } from 'react';
import { IItem, IProperty } from '../../interfaces';

interface ItemRowProps {
  item: IItem;
  collectionProperties: IProperty[];
  onItemClick: (id: number) => void;
}

const ItemRow: FC<ItemRowProps> = (props) => {
  const { item, collectionProperties, onItemClick } = props;

  const handleClick = () => {
    if (!item._id) return;
    onItemClick(item._id);
  };

  const getValueById = (id?: number): string => {
    if (!id) return '';
    const property = item.properties.find((property) => property._id === id);
    if (!property) return '';
    return property.value;
  };

  return (
    <tr onClick={handleClick} className='cursor-pointer'>
      <td className='border-2 border-gray-300 dark:border-gray-600'>
        {item.name}
      </td>
      {collectionProperties.map(
        (property) =>
          property._id && (
            <td
              key={property._id}
              className='border-2 border-gray-300 dark:border-gray-600'>
              <MiniProperty property={property} getValue={getValueById} />
            </td>
          )
      )}
    </tr>
  );
};

interface MiniPropertyProps {
  property: IProperty;
  getValue: (id?: number) => string;
}

const MiniProperty: FC<MiniPropertyProps> = (props) => {
  const { property, getValue } = props;
  switch (property.type) {
    case 'checkbox':
      return (
        <span className='flex items-center space-x-0.5'>
          {getValue(property._id) === 'true' ? (
            <CheckIcon className='icon-xs' />
          ) : (
            <XIcon className='icon-xs' />
          )}
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

export default ItemRow;
