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
      <span className='text-xs font-light italic'>
        {item.updatedAt ? new Date(item.updatedAt).toDateString() : 'Loading'}
      </span>
    </button>
  );
};

export default ItemOverview;
