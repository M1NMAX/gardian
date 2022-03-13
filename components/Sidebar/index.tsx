import React, { FC } from 'react';
import ThemeBtn from '../ThemeBtn';
import { ChevronDoubleLeftIcon, CollectionIcon, PlusIcon, SearchIcon } from '@heroicons/react/outline';
import SidebarBtn from '../SidebarBtn';
import SidebarIconBtn from '../SidebarIconBtn';
import SidebarCollection from '../SidebarCollection';
import SidebarUserOptions from '../SidebarUserOptions';


const Sidebar: FC = () => {
    return (
        <div className={`w-3/4 sm:w-60 transition-all 
        duration-200 ease-linear fixed top-0 left-0 z-10  h-screen  overflow-hidden
        bg-gray-100 dark:bg-gray-800 dark:text-white`}>
            <div className="flex flex-col px-1 py-2  space-y-1">

                <div className='flex justify-between '>
                    <SidebarUserOptions />
                    <SidebarIconBtn icon={<ChevronDoubleLeftIcon />} />
                </div>

                <SidebarBtn icon={<SearchIcon />} text="Quick search" />

                <div className='flex justify-between items-center'>
                    <SidebarBtn icon={<CollectionIcon />} text="Collections" />
                    <SidebarIconBtn icon={<PlusIcon />} />
                </div>

                <div className='flex flex-col h-1/2 w-full overflow-y-auto'>
                    <SidebarCollection name='js' id='js' />
                    <SidebarCollection name='js2' id='js2' />
                    <SidebarCollection name='js3' id='js3' />
                    <SidebarCollection name='js4' id='js4' />
                    <SidebarCollection name='js5' id='js5' />

                </div>

                <div className='absolute bottom-1'>

                    <ThemeBtn />
                </div>
            </div>
        </div>
    )
}



export default Sidebar