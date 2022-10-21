import React, { FC, forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  sizing?: 'sm' | 'md';
  radious?: 'sm' | 'md';
  srLabel?: string;
  icon?: ReactNode;
  rightSection?: ReactNode;
}
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    sizing = 'md',
    radious = 'md',
    name,
    srLabel,
    icon,
    rightSection,
    ...theirProps
  } = props;

  const id = useId();

  return (
    <label htmlFor={id} className='relative block w-full'>
      <span className='sr-only'>{srLabel}</span>
      {icon && (
        <span
          className='absolute inset-y-0 left-0 flex items-center pl-2  
      text-gray-600 dark:text-gray-200'>
          {icon}
        </span>
      )}
      <input
        id={id}
        ref={ref}
        {...theirProps}
        className={`${icon ? 'pl-9' : 'pl-1.5'} ${
          rightSection ? 'pr-8' : 'pr-1.5'
        } ${sizing === 'sm' ? 'h-8' : 'h-10'} ${
          radious === 'sm' ? 'rounded-sm' : 'rounded'
        }
        block w-full  px-1.5 font-medium  border-0 bg-gray-200
         dark:bg-gray-800 outline outline-gray-300 dark:outline-gray-600
         dark:focus:outline-none focus:outline-none focus:ring-1 focus-visible:ring-primary-200`}
      />
      {rightSection && (
        <span
          className='absolute inset-y-0 right-0 flex items-center pr-0.5  
      text-gray-600 dark:text-gray-200'>
          {rightSection}
        </span>
      )}
    </label>
  );
});

export default Input;
