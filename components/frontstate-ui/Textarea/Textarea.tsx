import React, { ChangeEvent, ChangeEventHandler, FC, ReactNode } from 'react';
import TextareaAutosize from 'react-textarea-autosize';


interface TextareaProps {
  label: string;
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
  return (
    <label
      className='w-full p-1 space-y-0.5 rounded-sm border border-dashed
     border-gray-300 dark:border-gray-600'>
      <span className='w-full flex items-center justify-between'>
        <span className='grow'>{label}</span>
        {menu}
      </span>
      <TextareaAutosize
        name={name}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        maxRows={maxRows}
        maxLength={maxLength}
        className='resize-none w-full px-2 rounded border-0 bg-gray-300 dark:bg-gray-700 
        focus:outline-none focus-visible:ring-1 focus-visible:ring-opacity-75
        focus-visible:ring-primary-100 scrollbar-thin scrollbar-thumb-gray-300
        dark:scrollbar-thumb-gray-600'
      />
    </label>
  );
};

export default Textarea;
