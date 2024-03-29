import React, { ChangeEventHandler, FC, ReactNode, useId } from 'react';


interface SelectProps {
  label?: string;
  placeholder?: string;
  name?: string;
  data: { label: string; value: string }[];
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  menu?: ReactNode;
}

const Select: FC<SelectProps> = (props) => {
  const { label, name, placeholder, data, value, onChange, menu } = props;
  const id = useId();
  return (
    <>
      <span className='w-full flex items-center justify-between'>
        <label htmlFor={id} className='grow'>
          {label}
        </label>
        {menu}
      </span>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className='w-full h-8 py-0 px-1.5 cursor-default rounded-sm  border-0 bg-gray-200
         dark:bg-gray-700 outline outline-1 outline-gray-300 dark:outline-gray-600
          dark:focus:outline-none focus:outline-none focus-visible:ring-1 
          focus-visible:ring-opacity-75 focus-visible:ring-primary-200'>
        {placeholder && (
          <option value='' selected disabled hidden>
            {placeholder}
          </option>
        )}

        {data.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
