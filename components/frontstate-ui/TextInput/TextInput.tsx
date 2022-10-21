import React, { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';


interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  menu?: ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const { label, error, menu, ...theirProps } = props;

  const id = useId();

  return (
    <>
      <span className='w-full flex items-center justify-between'>
        <label htmlFor={id} className='grow'>
          {label}
        </label>
        {menu}
      </span>
      <input
        id={id}
        ref={ref}
        {...theirProps}
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
});

export default TextInput;
