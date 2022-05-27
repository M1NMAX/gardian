import React, { FC } from 'react';
import { ITemplate } from '../../interfaces';

interface TemplateOverviewProps {
  template: ITemplate;
}
const TemplateOverview: FC<TemplateOverviewProps> = (props) => {
  const { template } = props;
  return (
    <button className='flex flex-col p-1 rounded shadow-md bg-gray-100 dark:bg-gray-800 '>
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
