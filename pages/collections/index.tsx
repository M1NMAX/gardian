import React from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { CollectionInterface } from '../../backend/interfaces'


async function fetchCollection(): Promise<CollectionInterface[]> {
    const res = await fetch('api/collections');
    return res.json().then(response => response.data);
}

const Collections: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
    const { data, error, isError, isLoading } = useQuery<CollectionInterface[], Error>('collections', fetchCollection);

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    console.log(typeof data)
    return (
        <>
            <Head>
                <title>Collections</title>
            </Head>
            <Sidebar />
            <main className='has-sidebar-width ml-60'>
                {user?.nickname}
                <ul>
                    {data?.map((collection, idx: number) => (
                        <li key={idx}>{collection.name}</li>
                    ))}
                </ul>


            </main>
        </>
    )
}

export default Collections

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        // access the user session
        const session = getSession(ctx.req, ctx.res);
        console.log(session)
        return { props: { customProp: 'bar' } };
    }
});