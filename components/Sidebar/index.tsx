import React, { FC } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import logoSrc from '../../public/logo192.png';
import ThemeBtn from '../ThemeBtn';
import { ChevronDoubleLeftIcon, CogIcon, CollectionIcon, PlusIcon, SearchIcon, SelectorIcon } from '@heroicons/react/outline';
import SidebarBtn from '../SidebarBtn';
import SidebarIconBtn from '../SidebarIconBtn';



const Sidebar: FC = () => {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <div className={`w-3/4 sm:w-56 transition-all 
        duration-200 ease-linear fixed top-0 left-0 z-10  h-screen  overflow-hidden
        bg-gray-100 dark:bg-gray-800 dark:text-white`}>
            <div className="flex flex-col  p-1 space-y-1">

                <div className='flex justify-between '>
                    <button className='flex items-center space-x-2 grow truncate rounded-sm hover:bg-gray-300'>
                        <div className="relative w-6 h-6 ">
                            <Image src={user?.picture || logoSrc} layout='fill' objectFit='contain'
                                className='rounded-full' />
                        </div>
                        <div className='flex items-center font-medium '>
                            {user?.nickname}
                            <SelectorIcon className='icon-xs' />
                        </div>
                    </button>
                    <SidebarIconBtn icon={<ChevronDoubleLeftIcon />} />
                </div>

                <SidebarBtn icon={<CogIcon />} text="Settings" />

                <SidebarBtn icon={<SearchIcon />} text="Quick search" />

                <div className='flex justify-between items-center'>
                    <SidebarBtn icon={<CollectionIcon />} text="Collections" />
                    <SidebarIconBtn icon={<PlusIcon />} />
                </div>

                <div className='h-1/2 w-full bg-red-500'>
                    jf
                </div>

                <div className='absolute bottom-1'>

                    <ThemeBtn />
                </div>
            </div>
        </div>
    )
}

export default Sidebar