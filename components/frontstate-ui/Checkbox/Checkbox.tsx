import React, { ChangeEventHandler, FC, ReactNode, useId } from 'react';


interface CheckboxProps {
  label?: string;
  name?: string;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  menu?: ReactNode;
}

const Checkbox: FC<CheckboxProps> = (props) => {
  const { label, name, checked, onChange, menu } = props;

  const id = useId();
  return (
    <span className='w-full flex items-center space-x-1.5'>
      <input
        id={id}
        type='checkbox'
        name={name}
        checked={checked}
        onChange={onChange}
        className='w-5 h-5 appearance-none rounded-sm border-0 
        bg-gray-200 dark:bg-gray-700 outline outline-1 outline-gray-300 
        dark:outline-gray-600 dark:focus:outline-none focus:outline-none 
        focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-primary-200
         checked:bg-primary-200
         dark:checked:bg-primary-100'
      />
      <label htmlFor={id} className='grow'>
        {label}
      </label>
      {menu}
    </span>
  );
};

export default Checkbox;
