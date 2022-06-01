import React, { FC } from 'react';
import { IItem } from '../../interfaces';

interface ItemOverviewProps {
  item: IItem;
  onItemClick: (id: Number) => void;
}
const ItemOverview: FC<ItemOverviewProps> = (props) => {
  const { item, onItemClick } = props;
  const handleClick = () => {
    if (!item._id) return;
    onItemClick(item._id);
  };
  return (
    <button
      onClick={handleClick}
      className='w-full flex flex-col p-1 rounded shadow-md bg-gray-100 dark:bg-gray-800 '>
      <span className=' font-semibold text-lg'>{item.name}</span>
      <span className='flex space-x-1 text-xs font-medium text-gray-400 dark:text-gray-300'>
        {item.properties.map((property) => (
          <span className='px-1'>{property.value}</span>
        ))}
      </span>
    </button>
  );
};

export default ItemOverview;
