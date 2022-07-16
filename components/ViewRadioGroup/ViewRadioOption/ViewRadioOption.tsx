import { RadioGroup } from '@headlessui/react';
import React, { FC, ReactNode } from 'react';

interface ViewRadioOptionProps {
  value: string;
  icon: ReactNode;
}

const ViewRadioOption: FC<ViewRadioOptionProps> = (props) => {
  const { value, icon } = props;
  return (
    <RadioGroup.Option
      value={value}
      className={({ checked }) =>
        `${
          checked ? 'bg-green-500  text-white' : 'bg-gray-100 dark:bg-gray-800'
        }
     relative rounded shadow-md p-0.5 cursor-pointer flex focus:outline-none`
      }>
      {({ checked }) => (
        <RadioGroup.Label
          as='p'
          className={`flex items-center space-x-1  font-medium ${
            checked ? 'text-white' : 'text-black dark:text-gray-50'
          }`}>
          {icon}
        </RadioGroup.Label>
      )}
    </RadioGroup.Option>
  );
};

export default ViewRadioOption;
