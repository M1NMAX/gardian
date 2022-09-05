import React, { FC } from 'react';
import { Item, Property } from '@prisma/client';
import ItemOverviewProperty from './ItemOverviewProperty';

interface ItemOverviewProps {
  item: Item;
  active: boolean;
  collectionProperty: Property[];
  onItemClick: (id: string) => void;
}
const ItemOverview: FC<ItemOverviewProps> = (props) => {
  const { item, active, collectionProperty, onItemClick } = props;

  const getValueById = (pid: string): string => {
    const property = item.properties.find((property) => property.id === pid);
    if (!property) return '';
    return property.value;
  };

  return (
    <button
      onClick={() => onItemClick(item.id)}
      className={`${
        active && 'border-r-2 border-green-500'
      }  flex flex-col p-1 rounded shadow-md bg-gray-100 dark:bg-gray-800 
      `}>
      <span className='w-full text-left font-semibold text-lg truncate '>
        {item.name}
      </span>
      <span className='w-full grid grid-flow-col auto-cols-max gap-0.5 md:gap-1 text-sm  overflow-x-auto scrollbar-none'>
        {collectionProperty.map(
          (property) =>
            getValueById(property.id) != '' && (
              <span
                key={property.id}
                className='px-0.5 rounded bg-white dark:bg-gray-600'>
                <ItemOverviewProperty
                  property={property}
                  getValue={getValueById}
                />
              </span>
            )
        )}
      </span>
    </button>
  );
};

export default ItemOverview;
