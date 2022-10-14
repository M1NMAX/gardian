import React, { FC } from 'react';


interface TitleProps {
  main: string;
  secondary: string;
}

const Title: FC<TitleProps> = (props) => {
  const { main, secondary } = props;
  return (
    <div className='mt-6 sm:mx-auto sm:w-full sm:max-w-md px-6'>
      <h3 className='text-lg font-semibold leading-7 text-gray-900 dark:text-gray-100 sm:leading-9 sm:truncate'>
        {main}
      </h3>
      <p>{secondary}</p>
    </div>
  );
};

export default Title;
