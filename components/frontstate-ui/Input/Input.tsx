import React, { ChangeEventHandler, FC, HTMLInputTypeAttribute, ReactNode } from 'react';


interface InputProps {
  type?: HTMLInputTypeAttribute;
  name?: string;
  srLabel?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  icon?: ReactNode;
}
const Input: FC<InputProps> = (props) => {
  const {
    type = 'text',
    name,
    srLabel,
    placeholder,
    value,
    onChange,
    icon,
  } = props;

  return (
    <label className='relative block'>
      <span className='sr-only'>{srLabel}</span>
      {icon && (
        <span
          className='absolute inset-y-0 left-0 flex items-center pl-2  
      text-gray-600 dark:text-gray-200'>
          {icon}
        </span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${
          icon ? 'pl-9 pr-3' : 'px-1.5'
        } block w-full h-10 py-1 font-medium rounded border-0 bg-gray-200
         dark:bg-gray-800 outline outline-gray-300 dark:outline-gray-600
         dark:focus:outline-none focus:outline-none focus:ring-1 focus-visible:ring-primary-200`}
      />
    </label>
  );
};

export default Input;
