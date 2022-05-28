import React, { FC } from 'react';
import { ITemplate } from '../../interfaces';

interface TemplateOverviewProps {
  template: ITemplate;
  onTemplateClick: (id: Number) => void;
}
const TemplateOverview: FC<TemplateOverviewProps> = (props) => {
  const { template, onTemplateClick } = props;

  const handleClick = () => {
    if (!template._id) return;
    onTemplateClick(template._id);
  };

  return (
    <button
      onClick={handleClick}
      className='flex flex-col p-1 rounded shadow-md bg-gray-100 dark:bg-gray-800 '>
      <span className=' font-semibold text-lg'>{template.name}</span>
      <span className='text-xs font-light italic'>
        {template.updatedAt
          ? new Date(template.updatedAt).toDateString()
          : 'Loading'}
      </span>
    </button>
  );
};

export default TemplateOverview;
