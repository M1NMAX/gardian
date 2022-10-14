import React, { FC, InputHTMLAttributes, useId } from 'react';


interface FloatingLabelInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isError?: boolean;
  errorMsg?: string;
}

const FloatingLabelInput: FC<FloatingLabelInputProps> = (props) => {
  const { label, isError, errorMsg, ...thierProps } = props;

  const id = useId();
  const helpId = useId();

  return (
    <div className='mt-4'>
      <div className='relative'>
        <input
          id={id}
          aria-describedby={helpId}
          placeholder=' '
          {...thierProps}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-md 
      border-2 appearance-none focus:outline-none focus:ring-0 peer ${
        isError
          ? 'border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 focus:border-red-600 dark:focus:border-red-500'
          : 'border-gray-600 dark:border-gray-500 text-gray-900 dark:text-white focus:border-green-600  dark:focus:border-green-500 '
      }`}
        />
        <label
          htmlFor={id}
          className={`absolute left-1
      duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0]
       bg-white dark:bg-gray-900 px-2 peer-focus:px-2 
       peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
       peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 
       peer-focus:-translate-y-4 font-medium ${
         isError
           ? 'text-red-600 dark:text-red-500'
           : ' text-gray-900 dark:text-white peer-focus:text-green-500 dark:peer-focus:text-green-600'
       }`}>
          {label}
        </label>
      </div>

      {isError && (
        <p
          id={helpId}
          className='mt-1 px-2 font-medium text-xs text-red-600 dark:text-red-500'>
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default FloatingLabelInput;
