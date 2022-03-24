import React, { FC } from 'react';
import logoSrc from '../../public/logo192.png';
import Image from 'next/image';

const Logo: FC = () => {
    return (
        <div className='relative w-10 h-10'>
            <Image src={logoSrc} layout='fill' objectFit='contain' alt='Gardian logo' />
            <p className='ml-12 mt-1 text-2xl font-bold '>Gardian</p>
        </div>
    )
}

export default Logo