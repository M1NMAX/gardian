import React, { FC } from 'react';
import { ITemplate } from '../../interfaces';
import Badge from '../Frontstate/Badge';

interface TemplateOverviewProps {
  template: ITemplate;
  onTemplateClick: (id: number) => void;
}
const TemplateOverview: FC<TemplateOverviewProps> = (props) => {
  const { template, onTemplateClick } = props;
  const { _id: id, name, properties } = template;

  const handleClick = () => {
    if (!id) return;
    onTemplateClick(id);
  };

  return (
    <button
      onClick={handleClick}
      className='flex flex-col p-1 rounded shadow-md bg-gray-100 dark:bg-gray-800 '>
      <span className=' font-semibold text-lg'>{name}</span>
      <span className='space-x-1 text-sm'>
        {properties.map((property) => (
          <Badge rounded='lg' size='xs'>
            {property.name}
          </Badge>
        ))}
      </span>
    </button>
  );
};

export default TemplateOverview;
