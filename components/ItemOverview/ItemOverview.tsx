import { AnnotationIcon, CalendarIcon } from '@heroicons/react/outline';
import { CheckIcon, XIcon } from '@heroicons/react/solid';
import React, { FC } from 'react';
import { IItem, IProperty } from '../../interfaces';

interface ItemOverviewProps {
  item: IItem;
  collectionProperty: IProperty[];
  onItemClick: (id: number) => void;
}
const ItemOverview: FC<ItemOverviewProps> = (props) => {
  const { item, collectionProperty, onItemClick } = props;
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
    <button
      onClick={handleClick}
      className='w-full flex flex-col p-1 rounded shadow-md bg-gray-100 dark:bg-gray-800'>
      <span className=' font-semibold text-lg'>{item.name}</span>
      <span className='flex space-x-1 text-sm font-medium text-gray-700 dark:text-gray-100'>
        {collectionProperty.map((property) => (
          <span className='px-0.5 rounded bg-white dark:bg-gray-600'>
            <MiniProperty property={property} getValue={getValueById} />
          </span>
        ))}
      </span>
    </button>
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
            <CheckIcon className='w-4 h-4' />
          ) : (
            <XIcon className='w-4 h-4' />
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

export default ItemOverview;
