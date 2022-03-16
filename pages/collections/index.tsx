import React from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { getUserCollections, createCollection } from '../../fetch/collections';
import dbConnect from '../../backend/database/dbConnect';
import Collection from '../../backend/models/Collection';
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
                <div className='flex justify-between'>
                    {!sidebar &&
                        <IconBtn icon={<MenuAlt2Icon />} onClick={() => setSidebar(true)} />}
                    <h1>Collections </h1>
                    <button>New</button>
                </div>
                {user?.nickname}
                <ul>
                    {data?.map((collection, idx: number) => (
                        <li key={idx}>{collection.name} {collection._id}</li>
                    ))}
                </ul>
                <button onClick={handleClick} >create</button>
            </main>
        </>
    )
}

export default Collections

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        dbConnect();
        const session = getSession(ctx.req, ctx.res);
        const collections = await Collection.find({ owner_id: session?.user?.sub }).sort({ createdAt: -1 });



        return { props: { customProp: 'bar' } };
    }
});