import React, { ChangeEventHandler, FC, useId } from 'react';


interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
const PasswordInput: FC<PasswordInputProps> = (props) => {
  const { label, name, placeholder, required, value, onChange } = props;
  const id = useId();
  return (
    <>
      <span className='w-full flex items-center justify-between'>
        <label htmlFor={id} className='grow'>
          {label}
        </label>
      </span>
      <input
        id={id}
        type='password'
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='w-full h-10 px-2 cursor-default rounded  border-0  
        bg-gray-300 dark:bg-gray-700 focus:outline-none focus-visible:ring-1
         focus-visible:ring-opacity-75 focus-visible:ring-primary-200'
      />
    </>
  );
};

export default PasswordInput;
