import React from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { getUserCollections, createCollection } from '../../fetch/collections';
import Collection from '../../components/Collection';
import { CollectionInterface } from '../../interfaces';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import IconBtn from '../../components/IconBtn';
import { MenuAlt2Icon } from '@heroicons/react/outline';

const Collections: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {

    const [sidebar, setSidebar] = useRecoilState(sidebarState);

    const { data, error, isError, isLoading } =
        useQuery<CollectionInterface[], Error>('collections', getUserCollections);

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }


    const handleClick = async () => {
        const res = await createCollection();
        console.log(res);
    }

    return (
        <>
            <Head>
                <title>Collections</title>
            </Head>
            <Sidebar />
            <main className={`${sidebar ? 'w-full md:has-sidebar-width md:ml-60' : 'w-full'} main-content`}>
                <div className='flex justify-between items-center'>

                    <div className='flex items-center space-x-2'>
                        {!sidebar && <IconBtn icon={<MenuAlt2Icon />} onClick={() => setSidebar(true)} />}
                        <h1 className='font-semibold text-xl'>Collections </h1>
                    </div>
                    <button onClick={handleClick} className='btn btn-primary'>New</button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-2 max-h-full
                overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
                    {data?.map((collection, idx: number) => (
                        <Collection key={idx} collection={collection} />
                    ))}


                </div>
            </main>
        </>
    )
}

export default Collections

export const getServerSideProps = withPageAuthRequired();