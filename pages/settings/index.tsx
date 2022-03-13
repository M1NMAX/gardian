import React from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Head from 'next/head';

const Settings: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
    return (
        <>
            <Head>
                <title>Account Settings</title>
            </Head>
            <main>Settings {user?.name}</main>
        </>
    )
}

export default Settings

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        // access the user session
        const session = getSession(ctx.req, ctx.res);
        console.log(session)
        return { props: { customProp: 'bar' } };
    }
});