import { RadioGroup } from '@headlessui/react';
import { ViewGridIcon, ViewListIcon } from '@heroicons/react/outline';
import React, { Dispatch, FC } from 'react';
import ViewRadioOption from './ViewRadioOption';

interface ViewRadioGroupProps {
  value: string;
  setValue: Dispatch<React.SetStateAction<string>>;
}

const ViewRadioGroup: FC<ViewRadioGroupProps> = (props) => {
  const { value, setValue } = props;

  return (
    <RadioGroup value={value} onChange={setValue}>
      <div className='max-w-fit flex space-x-1 rounded p-0.5 bg-gray-50 dark:bg-gray-700'>
        <ViewRadioOption
          value='grid'
          icon={<ViewGridIcon className='icon-sm' />}
        />
        <ViewRadioOption
          value='list'
          icon={<ViewListIcon className='icon-sm' />}
        />
      </div>
    </RadioGroup>
  );
};

export default ViewRadioGroup;
