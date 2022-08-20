import { TemplateIcon } from '@heroicons/react/outline';
import React, { FC } from 'react';
import { ITemplate } from '../../interfaces';

interface TemplateOverviewProps {
  template: ITemplate;
  active: boolean;
  view: string;
  onClickTemplate: (id: string) => void;
}
const TemplateOverview: FC<TemplateOverviewProps> = (props) => {
  const { template, active, view, onClickTemplate } = props;
  const { _id: id, name, description, properties } = template;

  const handleClick = () => {
    if (!id) return;
    onClickTemplate(id);
  };

  return (
    <button
      onClick={handleClick}
      className={`${
        active && 'border-r-2 border-green-500'
      }  flex flex-col p-1 space-y-[1px] rounded shadow-md bg-gray-100 dark:bg-gray-800 
      `}>
      <span className='grow flex items-center space-x-1'>
        <TemplateIcon className='icon-xs' />
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
      {view === 'list' && <span className='text-left'>{description}</span>}
    </button>
  );
};

export default TemplateOverview;
