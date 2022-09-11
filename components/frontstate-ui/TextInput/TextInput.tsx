import React, { ChangeEventHandler, FC, ReactNode, useId } from 'react';


interface TextInputProps {
  type?: 'text' | 'url' | 'date' | 'number';
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  menu?: ReactNode;
}

const TextInput: FC<TextInputProps> = (props) => {
  const {
    label,
    type = 'text',
    name,
    placeholder,
    value,
    onChange,
    menu,
  } = props;

  const id = useId();

  return (
    <div>
      <div>
        <label htmlFor={id}>{label}</label>
        {menu}
      </div>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='w-full h-10 px-2 cursor-default rounded  border-0  
        bg-gray-300 dark:bg-gray-700 focus:outline-none focus-visible:ring-1
         focus-visible:ring-opacity-75 focus-visible:ring-primary-200'
      />
    </div>
  );
};

export default TextInput;
