import React, { FC, useEffect, useState } from 'react';
import ThemeBtn from '../ThemeBtn';
import { ChevronDoubleLeftIcon, CollectionIcon, PlusIcon, SearchIcon } from '@heroicons/react/outline';
import SidebarBtn from '../SidebarBtn';
import IconBtn from '../IconBtn';
import SidebarCollection from '../SidebarCollection';
import SidebarUserOptions from '../SidebarUserOptions';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useRecoilState } from 'recoil';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { CollectionInterface } from '../../interfaces';
import { getUserCollections } from '../../fetch/collections';
import { useQuery } from 'react-query';
import { toast, Toaster } from 'react-hot-toast';
import NewCollectionModal from '../NewCollectionModal';
import { useRouter } from 'next/router';
import Logo from '../Logo';


const Sidebar: FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data, error, isError, isLoading } =
        useQuery<CollectionInterface[], Error>('collections', getUserCollections);



    const { width } = useWindowDimensions();
    const [sidebar, setSidebar] = useRecoilState(sidebarState)

    //Menu is open if window width > 768px, tailwind ´md´ 
    useEffect(() => {
        if (width > 768) setSidebar(true)
    }, [width])


    //Modal: create collection
    const [open, setOpen] = useState(false);
    const closeModal = () => (setOpen(false));
    const openModal = () => (setOpen(true));

    const positiveFeedback = (msg: string) => toast.success(msg);
    const negativeFeedback = () => toast.success("Something went wrong, try later");



    return (
        <div className={`${sidebar ? 'w-3/4 sm:w-60' : 'w-0'} transition-all 
        duration-200 ease-linear fixed top-0 left-0 z-10  h-screen  overflow-hidden
        bg-gray-100 dark:bg-gray-800 dark:text-white`}>
            <div className="flex flex-col px-1 py-2  space-y-1 ">

                <div className='flex justify-between '>
                    <SidebarUserOptions />
                    <IconBtn icon={<ChevronDoubleLeftIcon />} variant="secondary" onClick={() => setSidebar(false)} />
                </div>

                <SidebarBtn icon={<SearchIcon />} text="Quick search" />

                <div className='flex justify-between items-center'>
                    <SidebarBtn icon={<CollectionIcon />} text="Collections"
                        onClick={() => router.push('/collections')} />
                    <IconBtn icon={<PlusIcon />} variant="secondary" onClick={openModal} />
                </div>

                <div className='flex flex-col space-y-1 sidebarCollections-height w-full overflow-y-auto 
                scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 '>
                    {data?.map((collection, idx: number) => (
                        <SidebarCollection key={idx} id={collection._id} name={collection.name}
                            variant={collection.variant} />
                    ))}
                    {isLoading && <span>Loading...</span>}
                    {isError && <span>Error: {error.message}</span>}
                </div>

                <div className='absolute bottom-1 w-full px-2 flex justify-between items-center '>
                    <Logo />
                    <ThemeBtn />
                </div>
            </div>
            <Toaster />
            {open && <NewCollectionModal open={open} isSub={false} collectionId={null}
                handleClose={closeModal} positiveFeedback={positiveFeedback}
                negativeFeedback={negativeFeedback} />}
        </div>
    )
}



export default Sidebar