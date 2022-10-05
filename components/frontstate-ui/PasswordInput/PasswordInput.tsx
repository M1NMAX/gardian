import React, { ChangeEventHandler, FC, FocusEventHandler, useId } from 'react';


interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  error?: string;
}
const PasswordInput: FC<PasswordInputProps> = (props) => {
  const { label, name, placeholder, required, value, onChange, onBlur, error } =
    props;
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
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full h-8 px-1.5 cursor-default rounded-sm border-0 
        bg-gray-200 dark:bg-gray-700 outline outline-1 outline-gray-300
        dark:outline-gray-600 dark:focus:outline-none focus:outline-none 
         focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-primary-200
         placeholder:italic placeholder:text-slate-400 ${
           error &&
           'outline-2 outline-danger-200 focus-visible:ring-danger-200 text-danger-200'
         } `}
      />
      {error && <span className='mt-1 text-danger-200 text-sm'>{error}</span>}
    </>
  );
};

export default PasswordInput;
