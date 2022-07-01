import React, { FC } from 'react';
import { ITemplate } from '../../interfaces';

interface TemplateOverviewProps {
  template: ITemplate;
  active: boolean;
  onTemplateClick: (id: number) => void;
}
const TemplateOverview: FC<TemplateOverviewProps> = (props) => {
  const { template, active, onTemplateClick } = props;
  const { _id: id, name, properties } = template;

  const handleClick = () => {
    if (!id) return;
    onTemplateClick(id);
  };

  return (
    <button
      onClick={handleClick}
      className={`${
        active && 'border-x-2 border-green-500'
      }  flex flex-col p-1 rounded shadow-md bg-gray-100 dark:bg-gray-800 
      `}>
      <span className=' font-semibold text-lg'>{name}</span>
      <span className='w-full grid grid-flow-col auto-cols-max gap-0.5 md:gap-1 text-sm overflow-x-auto scrollbar-none'>
        {properties.map((property) => (
          <span className=' text-sm font-semibold px-1 rounded bg-white dark:bg-gray-700 '>
            {property.name}
          </span>
        ))}
      </span>
    </button>
  );
};

export default TemplateOverview;
