import React from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { getUserCollections, createCollection } from '../../fetch/collections';
import { Response } from '../../types';

const Collections: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {

    const { data: response, error, isError, isLoading } = useQuery<Response, Error>('collections', getUserCollections);

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    console.log(typeof response?.data)

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
            <main className='has-sidebar-width ml-60'>
                {user?.nickname}
                <ul>
                    {response?.data?.map((collection, idx: number) => (
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
        // access the user session
        const session = getSession(ctx.req, ctx.res);
        console.log(session)
        return { props: { customProp: 'bar' } };
    }
});