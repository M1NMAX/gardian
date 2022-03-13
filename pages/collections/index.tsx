import React from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';

const Collections: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
    return (
        <>
            <Head>
                <title>Collections</title>
            </Head>
            <Sidebar />
            <main className='has-sidebar-width ml-56'>
            {user?.picture}
            {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
                <a href="/api/auth/logout">Logout</a>

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