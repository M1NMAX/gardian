import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { APP_NAME } from '@constants';
import Logo from '@public/assets/gardian.png';


const Header = () => {
  return (
    <div className='sm:mx-auto sm:w-full sm:max-w-md text-center pt-4'>
      <Link href='/'>
        <a>
          <Image
            src={Logo}
            width={64}
            height={64}
            alt='Gardian Logo'
            objectFit='contain'
          />
        </a>
      </Link>
      <div className='sm:mx-auto sm:w-full sm:max-w-md text-center'>
        <h1 className='text-xl font-bold leading-7 text-gray-900 dark:text-gray-50 sm:leading-9 sm:truncate'>
          {APP_NAME}
        </h1>
      </div>
    </div>
  );
};

export default Header;
