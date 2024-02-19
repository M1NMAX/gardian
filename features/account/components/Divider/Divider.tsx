import React, { FC } from 'react';


interface DividerProps {
  msg: string;
}

const Divider: FC<DividerProps> = (props) => {
  const { msg } = props;

  return (
    <div className='flex flex-col mb-3'>
      <hr className='h-0 border-t mt-1' />
      <div className='-mt-3 text-sm text-center'>
        <span className='px-2 bg-white dark:bg-gray-900 text-secondary'>
          {msg}
        </span>
      </div>
    </div>
  );
};

export default Divider;
