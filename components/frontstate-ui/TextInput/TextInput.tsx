import React, {
  ChangeEventHandler,
  FC,
  HTMLInputTypeAttribute,
  ReactNode,
  useId
} from 'react';


interface TextInputProps {
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  pattern?: string;
  error?: string;
  menu?: ReactNode;
}

const TextInput: FC<TextInputProps> = (props) => {
  const {
    label,
    type = 'text',
    required,
    name,
    placeholder,
    value,
    onChange,
    pattern,
    error,
    menu,
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
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        placeholder={placeholder}
        pattern={pattern}
        className='w-full h-8 px-1.5 cursor-default rounded-sm border-0 
      bg-gray-200 dark:bg-gray-700 outline outline-1 outline-gray-300
      dark:outline-gray-600 dark:focus:outline-none focus:outline-none 
       focus-visible:ring-1 focus-visible:ring-opacity-75 focus-visible:ring-primary-200
       placeholder:italic placeholder:text-slate-400'
      />
    </>
  );
};

export default TextInput;
