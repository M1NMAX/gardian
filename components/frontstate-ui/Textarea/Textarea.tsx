import React, { ChangeEvent, ChangeEventHandler, FC, ReactNode, useId } from 'react';
import TextareaAutosize from 'react-textarea-autosize';


interface TextareaProps {
  label?: string;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  name?: string;
  placeholder?: string;
  menu?: ReactNode;
  maxLength?: number;
  maxRows?: number;
}

const Textarea: FC<TextareaProps> = (props) => {
  const {
    label,
    name,
    value,
    onChange,
    placeholder,
    menu,
    maxLength,
    maxRows,
  } = props;

  const id = useId();
  return (
    <>
      <span className='w-full flex items-center justify-between'>
        <label htmlFor={id} className='grow'>
          {label}
        </label>
        {menu}
      </span>
      <TextareaAutosize
        id={id}
        name={name}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        maxRows={maxRows}
        maxLength={maxLength}
        className='resize-none w-full py-[5px] px-1.5 rounded-sm border-0 bg-gray-300 
        dark:bg-gray-700 outline outline-1 outline-gray-300
        dark:outline-gray-600 dark:focus:outline-none
        focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75
        focus-visible:ring-primary-100 scrollbar-thin scrollbar-thumb-gray-400
        dark:scrollbar-thumb-gray-600 '
      />
    </>
  );
};

export default Textarea;
