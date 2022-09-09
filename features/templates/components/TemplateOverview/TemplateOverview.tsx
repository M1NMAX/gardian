import React, { FC } from 'react';
import { Icon } from '@features/Icons';
import { RectangleGroupIcon } from '@heroicons/react/24/outline';
import { Template } from '@prisma/client';


interface TemplateOverviewProps {
  template: Template;
  active: boolean;
  isGridView: boolean;
  onClickTemplate: (id: string) => void;
}
const TemplateOverview: FC<TemplateOverviewProps> = (props) => {
  const { template, active, isGridView, onClickTemplate } = props;
  const { id, icon, name, description, properties } = template;

  return (
    <button
      onClick={() => onClickTemplate(id)}
      className={`${
        active && 'border-r-2 border-green-500'
      }  flex flex-col p-1 space-y-[1px] rounded shadow-md bg-gray-100 dark:bg-gray-800 
      `}>
      <span className='grow flex items-center space-x-1'>
        <Icon icon={icon} defaultIcon={<RectangleGroupIcon />} />
        <span className='grow font-semibold text-lg'>{name}</span>
      </span>

      <span className='w-full grid grid-flow-col auto-cols-max gap-0.5 md:gap-1 text-sm overflow-x-auto scrollbar-none'>
        {properties.map((property, idx) => (
          <span
            key={idx}
            className=' text-sm font-semibold px-1 rounded bg-white dark:bg-gray-700 '>
            {property.name}
          </span>
        ))}
      </span>
      {!isGridView && <span className='text-left'>{description}</span>}
    </button>
  );
};

export default TemplateOverview;
