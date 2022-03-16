import React, { FC, useEffect } from 'react';
import ThemeBtn from '../ThemeBtn';
import { ChevronDoubleLeftIcon, CollectionIcon, PlusIcon, SearchIcon } from '@heroicons/react/outline';
import SidebarBtn from '../SidebarBtn';
import IconBtn from '../IconBtn';
import SidebarCollection from '../SidebarCollection';
import SidebarUserOptions from '../SidebarUserOptions';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useRecoilState } from 'recoil';
import useWindowDimensions from '../../hooks/useWindowDimensions';


const Sidebar: FC = () => {

    const { width } = useWindowDimensions();
    const [sidebar, setSidebar] = useRecoilState(sidebarState)

    //Menu is open if window width > 768px, tailwind ´md´ 
    useEffect(() => {
        if (width > 768) setSidebar(true)
    }, [width])



    return (
        <div className={`${sidebar ? 'w-3/4 sm:w-60' : 'w-0'} transition-all 
        duration-200 ease-linear fixed top-0 left-0 z-10  h-screen  overflow-hidden
        bg-gray-100 dark:bg-gray-800 dark:text-white`}>
            <div className="flex flex-col px-1 py-2  space-y-1 ">

                <div className='flex justify-between '>
                    <SidebarUserOptions />
                    <IconBtn icon={<ChevronDoubleLeftIcon />} onClick={() => setSidebar(false)} />
                </div>

                <SidebarBtn icon={<SearchIcon />} text="Quick search" />

                <div className='flex justify-between items-center'>
                    <SidebarBtn icon={<CollectionIcon />} text="Collections" />
                    <IconBtn icon={<PlusIcon />} />
                </div>

                <div className='flex flex-col sidebarCollections-height w-full overflow-y-auto 
                scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 '>
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